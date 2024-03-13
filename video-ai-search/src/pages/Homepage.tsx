// change this component to client component
'use client'

import { useState, useEffect } from "react"
import { ProfileCard } from "@/src/components/ProfileCard"
import { SearchInput } from "@/src/components/SearchInput"
import { data, iProfile } from "@/src/services/data"
import { useSearchParams } from 'next/navigation'

const Home = () => {

    // initialize useState for the data

    const [profileData, setProfileData] = useState<iProfile[]>([])
    const searchParams = useSearchParams()
    // Now get the query 
    const searchQuery = searchParams && searchParams.get("q"); // we use `q` to set the query to the browser, it could be anything

    useEffect(() => {

        const handleSearch = () => {

            // Filter the data based on search query
            const findUser = data.filter((user) => {
                if (searchQuery) {
                    return (
                        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                } else {
                    // If no search query, return the original data
                    return true;
                }

            });


            // Update profileData based on search results

            setProfileData(findUser);

        };


        // Call handleSearch when searchQuery changes

        handleSearch();

    }, [searchQuery]); // Only rerun the effect if searchQuery changes



    // get total users

    const totalUser = profileData.length;

    return (

        <section className="h-[100vh] w-screen flex flex-col items-center">
            <div className="flex flex-row justify-between w-full mb-10">
            <p className="mb-0">Showing {totalUser} {totalUser > 1 ? "Users" : "User"}</p>
            <SearchInput defaultValue={searchQuery} />
            </div>
            {/* // Conditionally render the profile cards */}
            <div className="mt-8">
                {totalUser === 0 ? <p>No result returned</p> : (
                    // return the profile cards here
                    <div className="flex flex-row gap-5">  
                        {profileData.map(({ username, role, name, photo, email }: iProfile) => {
                            return (
                                <div key={username}>
                                    <ProfileCard name={name} role={role} photo={photo} email={email} username={username} />
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}

export default Home
