
// change this component to client component

'use client'

import { useState, useEffect } from "react";
import { ProfileCard } from "@/components/ProfileCard";
import { SearchInput } from "@/components/SearchInput";
import { data, iProfile } from "@/services/data";

const ITEMS_PER_PAGE = 6; 

const Home = () => {
  // Initialize state for fetched data, filtered data, current page, and search query
  const [fetchedData, setFetchedData] = useState<iProfile[]>([]);
  const [filteredData, setFilteredData] = useState<iProfile[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    // Fetch all JSON files from the 'data' directory
    const importJsonFiles = async () => {
      try {
        const files = await importAll(require.context("../../../video-intelligence-api/label_analysis_results", false, /\.json$/));

        console.log(files)
        setFetchedData(files);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    importJsonFiles();
  }, []);

  // Update filtered data whenever searchQuery or fetchedData changes
  useEffect(() => {
    const newData = fetchedData.map(userData => {
        const userId = Object.keys(userData)[0]; // Get the user ID

        document.addEventListener('select', (event) => {
          event.preventDefault();
        });
      
        const filteredEntries = userData[userId].filter(entry => {
            const lowerSearchQuery = searchQuery.toLowerCase();
            const lowerEntity = entry.entity.toLowerCase();
            
            const entityMatch = lowerEntity.includes(lowerSearchQuery);

            const categoryMatch = entry.categories && entry.categories.some(category =>
                category.toLowerCase().includes(lowerSearchQuery)
            );

            return entityMatch || categoryMatch;
        });

        // Only return user data if there are filtered entries
        if (filteredEntries.length > 0) {
            return {
                [userId]: filteredEntries
            };
        }
    }).filter(Boolean);

    setFilteredData(newData);
    setCurrentPage(1);
}, [fetchedData, searchQuery]);

  // Get the total number of pages based on filtered data
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  // Get the data for the current page
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };



  // Render profile cards
  const renderProfileCards = () => (
    <div className="mt-8 px-4 flex justify-center">
      {paginatedData.length === 0 ? (
        <p>No result returned</p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-10">
          {paginatedData.map((pageData, pageIndex) => (
            <div key={pageIndex}>
              {Object.entries(pageData).map(([fileName, entities], index) => (
                <ProfileCard
                  key={fileName} // Use filename as the key for each card
                  name={fileName} // Use filename as the name for each card
                  roleTag={entities}
                  videoID={fileName}
                  // Add other props as needed for ProfileCard component
                />
              ))}
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
            className={`px-2 py-1 mr-2 rounded-md text-sm hover:bg-gray-200 ${currentPage === i + 1 ? "bg-gray-200" : ""
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
    <section className="h-[100vh]">
      <div className="mt-3">
        <p className="text-center w-[250px] mx-auto px-4 py-2">
          Showing {filteredData.length} {filteredData.length > 1 ? "Users" : "User"}
        </p>
      </div>
      <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {renderProfileCards()}
      {renderPagination()}
    </section>
  );
};

export default Home;

// Function to import all JSON files from a directory
function importAll(r) {
  const fileNames = r.keys();
  console.log("File names:", fileNames);
  const files = fileNames.map((fileName) => {
    // Extract the filename from the path using string manipulation
    const fileNameWithoutExtension = fileName.replace(/^.*[\\\/]/, '').replace(/\.\w+$/, '');
    const file = r(fileName);
    // console.log("File content:", file);
    // Return an object with the filename as the key
    return { [fileNameWithoutExtension]: file };
  });
  // console.log("Imported files:", files);
  return files;
}