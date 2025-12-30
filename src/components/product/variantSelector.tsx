"use client"
import { ProductVariantSummary } from "@/types/Product";
import { useEffect, useMemo, useState } from "react";


type AvailableOptions = Record<string, string[]>;
type SelectedOptions = Record<string, string | null>;

interface Attribute {
    option_name: string;
    option_value: string;
}

export default function VariantSelector({ variantsData }: { variantsData: ProductVariantSummary[] }) {

    // 1. Estado para guardar la selección actual del usuario
    const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
    // 2. Estado para guardar la variante final seleccionada (el SKU)
    const [selectedVariant, setSelectedVariant] = useState<ProductVariantSummary | null>(null);
    const allAvailableOptions: AvailableOptions = useMemo(() => {
        const optionsMap: Record<string, Set<string>> = {};

        variantsData.forEach(variant => {
            // Aserción: Aceptamos que 'attributes' es un array de Attribute[]
            const variantAttributes = variant.attributes as unknown as Attribute[];

            variantAttributes?.forEach(attr => {
                if (!optionsMap[attr.option_name]) {
                    optionsMap[attr.option_name] = new Set();
                }
                optionsMap[attr.option_name].add(attr.option_value);
            });
        });

        const result: AvailableOptions = {};
        for (const name in optionsMap) {
            result[name] = Array.from(optionsMap[name]);
        }
        return result;
    }, [variantsData]);

    const availableValues: AvailableOptions = useMemo(() => {
        // 1. Filtrar variantes que coincidan con las selecciones actuales
        const filteredVariants = variantsData.filter(variant => {
            // Verificar si la variante coincide con todas las opciones seleccionadas
            return Object.entries(selectedOptions).every(([optionName, selectedValue]) => {
                if (!selectedValue) return true; // Ignora las opciones no seleccionadas

                const variantAttributes = variant.attributes as unknown as Attribute[];

                // Verificación y uso
                if (variantAttributes) {
                    return variantAttributes.some(attr =>
                        attr.option_name === optionName && attr.option_value === selectedValue
                    );
                }
                return false;
            });
        });

        // 2. Agrupar los valores únicos de las variantes filtradas
        const currentAvailableMap: Record<string, Set<string>> = {};

        filteredVariants.forEach(variant => {
            const variantAttributes = variant.attributes as unknown as Attribute[];
            variantAttributes?.forEach(attr => {
                if (!currentAvailableMap[attr.option_name]) {
                    currentAvailableMap[attr.option_name] = new Set();
                }
                currentAvailableMap[attr.option_name].add(attr.option_value);
            });
        });

        // 3. Convertir Sets a Arrays
        const result: AvailableOptions = {};
        for (const name in currentAvailableMap) {
            result[name] = Array.from(currentAvailableMap[name]);
        }

        return result;
    }, [variantsData, selectedOptions]);

    useEffect(() => {
        // Verifica si todas las opciones han sido seleccionadas
        const allOptionsSelected = Object.keys(allAvailableOptions).length > 0 &&
            Object.keys(allAvailableOptions).length === Object.keys(selectedOptions).length &&
            Object.values(selectedOptions).every(val => val !== null);

        if (allOptionsSelected) {
            // Intenta encontrar la variante exacta
            const finalVariant = variantsData.find(variant => {
                const variantAttributes = variant.attributes as unknown as Attribute[];
                return variantAttributes?.every(attr => selectedOptions[attr.option_name] === attr.option_value)
            });
            setSelectedVariant(finalVariant || null);

            // (Opcional) Si la variante final no tiene stock, puedes mostrar un mensaje de error aquí.
        } else {
            setSelectedVariant(null);
        }
    }, [selectedOptions, variantsData, allAvailableOptions]);

    const handleOptionChange = (optionName: string, optionValue: string) => {

        // --- 1. Definir las nuevas selecciones parciales ---
        const newSelectedOptions: SelectedOptions = {
            ...selectedOptions,
            [optionName]: optionValue,
        };

        // --- 2. Encontrar variantes candidatas con la nueva selección ---
        const candidateVariants = variantsData.filter(variant => {
            // Usamos la doble aserción para manejar el tipo JSONB
            const variantAttributes = variant.attributes as unknown as Attribute[];

            return Object.entries(newSelectedOptions).every(([name, value]) => {
                if (!value) return true;

                return variantAttributes?.some(attr =>
                    attr.option_name === name && attr.option_value === value
                );
            });
        });

        // --- 3. Iterar sobre Opciones Restantes y Aplicar Lógica de Selección ---

        const finalSelections: SelectedOptions = { ...newSelectedOptions };

        // Objeto temporal para mapear los valores disponibles en las variantes candidatas
        const currentAvailableValuesMap: Record<string, Set<string>> = {};

        // Primero, poblamos el mapa de todos los valores disponibles de las variantes candidatas
        candidateVariants.forEach(variant => {
            const variantAttributes = variant.attributes as unknown as Attribute[];
            variantAttributes.forEach(attr => {
                if (!currentAvailableValuesMap[attr.option_name]) {
                    currentAvailableValuesMap[attr.option_name] = new Set();
                }
                currentAvailableValuesMap[attr.option_name].add(attr.option_value);
            });
        });

        // Ahora, iteramos sobre todas las opciones para aplicar la lógica:
        Object.keys(allAvailableOptions).forEach(otherOptionName => {

            // Si la opción no se ha tocado en este clic, aplicamos la lógica de auto-selección o validación
            if (otherOptionName !== optionName) {

                const availableValuesSet = currentAvailableValuesMap[otherOptionName];

                // A) LÓGICA DE AUTO-SELECCIÓN FORZADA (El nuevo requerimiento)
                if (availableValuesSet && availableValuesSet.size === 1) {
                    // Si solo hay un valor disponible para este atributo, lo seleccionamos automáticamente.
                    const uniqueValue = availableValuesSet.values().next().value;
                    finalSelections[otherOptionName] = uniqueValue ?? null;
                    console.log(`Auto-selección Única: ${otherOptionName} fue fijado a '${uniqueValue}'`);
                    return; // Pasa al siguiente atributo
                }

                // B) LÓGICA DE VALIDACIÓN (Si hay múltiples opciones disponibles o ninguna)

                const prevSelectedValue = selectedOptions[otherOptionName];

                if (prevSelectedValue) {
                    // Comprobamos si el valor previamente seleccionado sigue existiendo
                    const prevValueStillValid = availableValuesSet && availableValuesSet.has(prevSelectedValue);

                    if (prevValueStillValid) {
                        // La selección previa sigue siendo válida, la mantenemos
                        finalSelections[otherOptionName] = prevSelectedValue;
                    } else {
                        // La selección previa es inválida, forzamos la selección del primer disponible (fallback)
                        const firstAvailable = availableValuesSet ? availableValuesSet.values().next().value : null;

                        if (firstAvailable) {
                            finalSelections[otherOptionName] = firstAvailable;
                            console.log(`Auto-selección Fallback: ${otherOptionName} cambió de '${prevSelectedValue}' a '${firstAvailable}'`);
                        } else {
                            // No hay opciones válidas, reseteamos
                            finalSelections[otherOptionName] = null;
                        }
                    }
                } else {
                    // Si no había nada seleccionado previamente, y no se activó la auto-selección única, mantenemos null
                    finalSelections[otherOptionName] = null;
                }
            }
        });

        // --- 4. Aplicar el Estado Final (la selección del usuario + las auto-selecciones) ---
        setSelectedOptions(finalSelections);
    };

    const isButtonDisabled = (optionName: string, optionValue: string): boolean => {
        // Si la opción no aparece en el mapa de valores disponibles tras el filtro, se deshabilita
        const availableValuesForOption = availableValues[optionName];

        // Si la opción está en el mapa, pero el valor específico no está en el array, significa que no hay SKUs válidos
        return !availableValuesForOption || !availableValuesForOption.includes(optionValue);
    };
    return (
        <div className="variant-selector">
            {/* Itera sobre todos los tipos de opciones (Talla, Color, Material, etc.) */}
            {Object.entries(allAvailableOptions).map(([optionName, values]) => (
                <div key={optionName} className="option-group">
                    <h3 className="text-lg font-semibold">{optionName}</h3>
                    <div className="flex space-x-2">
                        {/* Itera sobre los valores posibles de cada tipo de opción (M, L, XL) */}
                        {values.map(value => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => handleOptionChange(optionName, value)}

                                className={`
                                        p-2 border rounded-md transition-colors cursor-pointer
                                        ${isButtonDisabled(optionName, value)
                                        ? 'bg-gray-200 text-gray-400'
                                        : selectedOptions[optionName] === value
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-gray-800 hover:bg-gray-100'
                                    }
                                `}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            {/* Mostrar información de la variante final seleccionada */}
            <div className="mt-6 p-4 border rounded-md bg-gray-50">
                {selectedVariant ? (
                    <>
                        <p className="text-xl font-bold">${selectedVariant?.variant_price?.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">SKU: {selectedVariant?.sku}</p>
                        <p className="text-sm text-gray-600">Stock Disponible: {selectedVariant?.variant_stock}</p>
                    </>
                ) : (
                    <p className="text-lg text-red-500">Selecciona todas las opciones para ver precio y stock.</p>
                )}
            </div>
        </div>
    );
}