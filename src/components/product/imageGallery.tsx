import Image from "next/image";
import { useState } from "react";

export default function ImageGallery({ images }: { images: { image_url: string }[] }) {

    const [activeImage, setActiveImage] = useState<{ image_url: string }>(() => {
        if (Array.isArray(images)) {
            return images[0];
        } else {
            return { image_url: images };
        }
    });

    return (
        <>
            <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden">
                {activeImage && <Image
                    src={activeImage.image_url}
                    alt={activeImage.image_url}
                    fill
                    className="object-cover"
                    priority
                />}
            </div>
            <div className="grid grid-cols-4 gap-4">
                {Array.isArray(images) ? images.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveImage(img)}
                        className={`relative aspect-square bg-gray-100 overflow-hidden border ${activeImage === img ? 'border-black' : 'border-transparent'}`}
                    >
                        <Image src={img.image_url} alt={`${img.image_url} ${index + 1}`} fill className="object-cover" />
                    </button>
                )) : (

                    <Image src={images} alt={images} fill className="object-cover" />

                )}
            </div>
        </>
    );
}