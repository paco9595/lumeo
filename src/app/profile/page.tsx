'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createBrowserClient } from '@/lib/supabase/createBrowserClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PencilIcon, UserCircleIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { AddressData, ProfileData } from '@/types/profile';

export default function Profile() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const supabase = createBrowserClient();

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Data States
    const [profile, setProfile] = useState<ProfileData>({
        first_name: '',
        last_name: '',
        email: '',
        role: 'Customer',
        bio: '',
        phone: '',
    });

    const [address, setAddress] = useState<AddressData>({
        country: '',
        city: '',
        postal_code: '',
        state: '',
        line1: ''
    });

    // Edit Modes
    const [editMode, setEditMode] = useState<{
        personal: boolean;
        address: boolean;
    }>({
        personal: false,
        address: false
    });

    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);



    useEffect(() => {
        if (message && message.type === 'success') {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            if (!user) return;

            // Fetch Profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError && profileError.code !== 'PGRST116') {
                console.error('Error loading profile:', profileError);
            }

            if (profileData) {
                setProfile(prev => ({
                    ...prev,
                    first_name: profileData.first_name || '',
                    last_name: profileData.last_name || '',
                    email: profileData.email || user.email || '',
                    role: profileData.role || 'Customer',
                    phone: profileData.phone_number || '',
                    // Note: Bio and Phone are not in DB based on provided schema. 
                    // We'll keep them in state to match UI but they won't persist to DB unless schema changes.
                    // For now we just use empty strings or maybe we assume they might be in metadata?
                    // Let's just stick to what we have in DB for persistence but keep UI fields editable (but maybe warn they are local only or just don't save them?)
                    // Actually, let's just implement saving for what we DO have.
                }));
            }

            // Fetch Address
            const { data: addressData } = await supabase
                .from('addresses')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (addressData) {
                setAddress({
                    id: addressData.id,
                    country: addressData.country || '',
                    city: addressData.city || '',
                    state: addressData.state || '',
                    postal_code: addressData.postal_code || '',
                    line1: addressData.line1 || '',
                });
            }

        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    }, [user, supabase])

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/sign-in');
        } else if (user) {
            fetchData();
        }
    }, [user, authLoading, router, fetchData]);
    async function updatePersonal(e: React.FormEvent) {
        e.preventDefault();
        if (!user) return;
        setUpdating(true);
        setMessage(null);

        try {
            const updates = {
                id: user.id,
                email: user.email!,
                first_name: profile.first_name,
                last_name: profile.last_name,
                phone_number: profile.phone,
                // We can't save bio/phone as they don't exist in DB schema. 
                // We will just proceed with saving connection details.
            };

            const { error } = await supabase.from('profiles').upsert(updates);
            if (error) throw error;

            // Update Auth Metadata
            await supabase.auth.updateUser({
                data: {
                    name: `${profile.first_name} ${profile.last_name}`.trim(),
                    full_name: `${profile.first_name} ${profile.last_name}`.trim(),
                }
            });

            setMessage({ type: 'success', text: 'Personal information updated!' });
            setEditMode(prev => ({ ...prev, personal: false }));

        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setUpdating(false);
        }
    }

    async function updateAddress(e: React.FormEvent) {
        e.preventDefault();
        if (!user) return;
        setUpdating(true);
        setMessage(null);

        try {
            const updates = {
                user_id: user.id,
                country: address.country, // Ensure database allows nulls if empty, or enforce required
                city: address.city,
                state: address.state,
                postal_code: address.postal_code,
                line1: address.line1
            };

            // Check if we need to update or insert. Upsert works if we have primary key (id), 
            // but addresses PK is ID (autoincrement). We're querying by user_id.
            // If we have an ID, we use it. If not, we insert new row tied to user_id.

            let error;
            if (address.id) {
                const { error: updateError } = await supabase
                    .from('addresses')
                    .update(updates)
                    .eq('id', address.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('addresses')
                    .insert([updates]);
                error = insertError;
            }

            if (error) throw error;

            setMessage({ type: 'success', text: 'Address updated!' });
            setEditMode(prev => ({ ...prev, address: false }));
            // Refresh to get new ID if inserted
            fetchData();

        } catch (error) {
            console.error('Error updating address:', error);
            setMessage({ type: 'error', text: 'Failed to update address' });
        } finally {
            setUpdating(false);
        }
    }

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-screen ">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header Title */}
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

                {/* Message Toast */}
                {message && (
                    <div className={`p-4 rounded-lg shadow-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'} flex justify-between items-center animate-fade-in-down transition-all duration-500`}>
                        <span>{message.text}</span>
                        <button onClick={() => setMessage(null)} className="text-sm font-semibold hover:underline">Close</button>
                    </div>
                )}

                {/* 1. Header Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
                    {/* Avatar Section */}
                    <div className="relative">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 relative">
                            {profile.image_url ? (
                                <Image src={profile.image_url} alt="Profile" fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <UserCircleIcon className="w-20 h-20 text-gray-400" />
                                </div>
                            )}
                        </div>
                        {/* Edit Avatar Button - Placeholder for now as file upload is complex */}
                        <button className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow-md border hover:bg-gray-50 text-gray-600 transition-colors">
                            <PencilIcon className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 text-center md:text-left pt-2">
                        <h2 className="text-2xl font-bold text-gray-900">{profile.first_name} {profile.last_name || ''}</h2>
                        <p className="text-gray-500 font-medium mb-1">{profile.role}</p>
                        <div className="flex items-center justify-center md:justify-start gap-1 text-gray-400 text-sm">
                            <MapPinIcon className="w-4 h-4" />
                            <span>{address.city ? `${address.city}, ${address.country}` : 'Location not set'}</span>
                        </div>
                    </div>

                    {/* Edit Button for Header Card? Or maybe just decorative per image. 
               The image has "Edit" on top right. Let's redirect to settings or just show it.
           */}
                    <button className="absolute top-6 right-6 flex items-center gap-1 text-gray-400 hover:text-black transition-colors text-sm font-medium border border-gray-200 px-3 py-1.5 rounded-full bg-white hover:bg-gray-50">
                        Edit <PencilIcon className="w-3.5 h-3.5 ml-1" />
                    </button>
                </div>

                {/* 2. Personal Information Card */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                        <button
                            onClick={() => setEditMode(prev => ({ ...prev, personal: !prev.personal }))}
                            className="flex items-center gap-1 text-gray-400 hover:text-black transition-colors text-sm font-medium border border-gray-200 px-3 py-1.5 rounded-full bg-white hover:bg-gray-50"
                        >
                            {editMode.personal ? 'Cancel' : 'Edit'} <PencilIcon className="w-3.5 h-3.5 ml-1" />
                        </button>
                    </div>

                    {editMode.personal ? (
                        /* Edit Form for Personal Info */
                        <form onSubmit={updatePersonal} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">First Name</label>
                                <input
                                    type="text"
                                    value={profile.first_name}
                                    onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                                    className="w-full border-b border-gray-200 py-2 text-gray-900 focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-300"
                                    placeholder="Enter first name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Last Name</label>
                                <input
                                    type="text"
                                    value={profile.last_name}
                                    onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                                    className="w-full border-b border-gray-200 py-2 text-gray-900 focus:outline-none focus:border-black transition-colors bg-transparent"
                                    placeholder="Enter last name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={profile.email} // Read only usually for consistency or need separate flow for email change
                                    disabled
                                    className="w-full border-b border-gray-200 py-2 text-gray-500 bg-transparent cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    className="w-full border-b border-gray-200 py-2 text-gray-900 focus:outline-none focus:border-black transition-colors bg-transparent"
                                    placeholder="Enter phone number"
                                />
                            </div>
                            <div className="md:col-span-2 mt-4">
                                <button type="submit" disabled={updating} className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-all disabled:opacity-50">
                                    {updating ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* View Mode for Personal Info */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">First Name</label>
                                <p className="text-gray-900 font-medium text-lg">{profile.first_name || '-'}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Last Name</label>
                                <p className="text-gray-900 font-medium text-lg">{profile.last_name || '-'}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Email address</label>
                                <p className="text-gray-900 font-medium text-lg truncate" title={profile.email}>{profile.email}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Phone</label>
                                <p className="text-gray-900 font-medium text-lg">{profile.phone || '-'}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-400 mb-1">Bio</label>
                                <p className="text-gray-900 font-medium text-lg">{profile.role || 'Customer'}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Address Card */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold text-gray-900">Address</h3>
                        <button
                            onClick={() => setEditMode(prev => ({ ...prev, address: !prev.address }))}
                            className="flex items-center gap-1 text-gray-400 hover:text-black transition-colors text-sm font-medium border border-gray-200 px-3 py-1.5 rounded-full bg-white hover:bg-gray-50"
                        >
                            {editMode.address ? 'Cancel' : 'Edit'} <PencilIcon className="w-3.5 h-3.5 ml-1" />
                        </button>
                    </div>

                    {editMode.address ? (
                        <form onSubmit={updateAddress} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Country</label>
                                <input
                                    type="text"
                                    value={address.country}
                                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                                    className="w-full border-b border-gray-200 py-2 text-gray-900 focus:outline-none focus:border-black transition-colors bg-transparent"
                                    placeholder="e.g. United Kingdom"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">City / State</label>
                                <input
                                    type="text"
                                    value={address.city}
                                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                    className="w-full border-b border-gray-200 py-2 text-gray-900 focus:outline-none focus:border-black transition-colors bg-transparent"
                                    placeholder="e.g. London"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Postal Code</label>
                                <input
                                    type="text"
                                    value={address.postal_code}
                                    onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                                    className="w-full border-b border-gray-200 py-2 text-gray-900 focus:outline-none focus:border-black transition-colors bg-transparent"
                                    placeholder="e.g. ERT 2354"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Address Line 1</label>
                                <input
                                    type="text"
                                    value={address.line1}
                                    onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                                    className="w-full border-b border-gray-200 py-2 text-gray-900 focus:outline-none focus:border-black transition-colors bg-transparent"
                                    placeholder="Street address"
                                />
                            </div>
                            <div className="md:col-span-2 mt-4">
                                <button type="submit" disabled={updating} className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-all disabled:opacity-50">
                                    {updating ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Country</label>
                                <p className="text-gray-900 font-medium text-lg">{address.country || '-'}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">City / State</label>
                                <p className="text-gray-900 font-medium text-lg">{address.city ? `${address.city}${address.state ? `, ${address.state}` : ''}` : '-'}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Postal Code</label>
                                <p className="text-gray-900 font-medium text-lg">{address.postal_code || '-'}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Address Line 1</label>
                                <p className="text-gray-900 font-medium text-lg">{address.line1 || '-'}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}