
// change this component to client component

'use client'
// Import necessary libraries
import { useState, useEffect } from "react"
import { ProfileCard } from "@/components/ProfileCard"
import { SearchInput } from "@/components/SearchInput"
import { data, iProfile } from "@/services/data"

const ITEMS_PER_PAGE = 6; // Number of items to display per page

const Home = () => {
  // Initialize state for data, current page, and search query
  const [profileData, setProfileData] = useState<iProfile[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data (replace with your actual data fetching logic)
  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => setProfileData(data), 1000);
  }, []);

  // Filter data based on search query
  const filteredData = profileData.filter((user) => {
    if (!searchQuery) return true;
    return (
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Get the total number of pages
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Get the data for the current page
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Render profile cards
  const renderProfileCards = () => (
    <div className="mt-8 px-4 flex justify-center">
      {paginatedData.length === 0 ? (
        <p>No result returned</p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-10">
          {paginatedData.map(({ username, role, name, photo, email }: iProfile) => (
            <div key={username}>
              <ProfileCard name={name} role={role} photo={photo} email={email} username={username} />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render pagination buttons (replace with your preferred UI library)
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`px-2 py-1 mr-2 rounded-md text-sm hover:bg-gray-200 ${
              currentPage === i + 1 ? "bg-gray-200" : ""
            }`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    );
  };

  return (
    <section className="h-[150vh] ">
      <div className="mt-3">
        <p className="text-center w-[250px] mx-auto px-4 py-2">
          Showing {filteredData.length} {filteredData.length > 1 ? "Users" : "User"}
        </p>
      </div>
      <SearchInput defaultValue={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      {renderProfileCards()}
      {renderPagination()}
    </section>
  );
};

export default Home;