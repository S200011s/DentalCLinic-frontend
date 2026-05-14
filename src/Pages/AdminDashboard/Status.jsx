// import AdminTables from "./AdminTables";
// import { useEffect, useState } from "react";
// import axios from "../../api/axiosInstance";
// import Charts from "../../components/Charts/Charts";

// const Status = () => {
//   const [counts, setCounts] = useState({
//     clients: 0,
//     doctors: 0,
//     services: 0,
//     appointments: 0,
//   });
//   useEffect(() => {
//     const fetchCounts = async () => {
//       try {
//         const { data } = await axios.get("/stats/counts");
//         setCounts(data);
//       } catch (error) {
//         console.error("Error fetching counts:", error);
//       }
//     };

//     fetchCounts();
//   }, []);

//   return (
//     <main className="h-full overflow-y-auto bg-white">
//       <div className="container px-6 mx-auto grid">
//         <h2
//           className="my-6 text-2xl font-semibold"
//           style={{ color: "#10244b" }}
//         >
//           Dashboard
//         </h2>

//         <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
//           {[
//             {
//               title: "Total clients",
//               value: counts.clients,
//               iconColor: "text-white bg-blue-500",
//               svgPath:
//                 "M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z",
//             },
//             {
//               title: "Total Doctors",
//               value: counts.doctors,
//               iconColor: "text-white bg-blue-500",
//               svgPath:
//                 "M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z",
//               rules: "evenodd",
//             },
//             {
//               title: "Appointments Numbers",
//               value: counts.appointments,
//               iconColor: "text-white bg-blue-500",
//               svgPath:
//                 "M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
//             },
//             {
//               title: "Total Services",
//               value: counts.services,
//               iconColor: "text-white bg-blue-500",
//               svgPath:
//                 "M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z",
//               rules: "evenodd",
//             },
//           ].map((card, idx) => (
//             <div
//               key={idx}
//               className="flex items-center  bg-white rounded-lg py-4 px-2 "
//               style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
//             >
//               <div className={`p-3 mr-2 rounded-full ${card.iconColor}`}>
//                 <svg
//                   className="w-5 h-5"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     d={card.svgPath}
//                     fillRule={card.rules || undefined}
//                     clipRule={card.rules || undefined}
//                   />
//                 </svg>
//               </div>
//               <div>
//                 <p className="text-md font-medium" style={{ color: "#10244b" }}>
//                   {card.title}
//                 </p>
//                 <p className="text-lg font-semibold text-gray-400">
//                   {card.value}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="container  mx-auto grid">
//           <h2
//             className="my-6 text-2xl font-semibold"
//             style={{ color: "#10244b" }}
//           >
//             Role Request
//           </h2>
//           <div className="w-full overflow-hidden rounded-lg shadow-xs">
//             <Charts/>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default Status;





import AdminTables from "./AdminTables";
import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import Charts from "../../components/Charts/Charts";
import { getReviewStats } from "../../api/review.service";
import { FaStar, FaUserMd, FaClinicMedical, FaSpinner } from "react-icons/fa";

const Status = () => {
  const [counts, setCounts] = useState({
    clients: 0,
    doctors: 0,
    services: 0,
    appointments: 0,
  });
  
  const [reviewStats, setReviewStats] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { data } = await axios.get("/stats/counts");
        setCounts(data);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    const fetchReviewStats = async () => {
      try {
        const data = await getReviewStats();
        setReviewStats(data.stats);
      } catch (error) {
        console.error("Error fetching review stats:", error);
      } finally {
        setReviewLoading(false);
      }
    };

    fetchCounts();
    fetchReviewStats();
  }, []);

  const approvedDoctors = reviewStats?.doctors?.find(s => s._id === "approved")?.count || 0;
  const pendingDoctors = reviewStats?.doctors?.find(s => s._id === "pending")?.count || 0;
  const rejectedDoctors = reviewStats?.doctors?.find(s => s._id === "rejected")?.count || 0;
  const approvedClinic = reviewStats?.clinic?.find(s => s._id === "approved")?.count || 0;
  const pendingClinic = reviewStats?.clinic?.find(s => s._id === "pending")?.count || 0;

  return (
    <main className="h-full overflow-y-auto bg-white">
      <div className="container px-6 mx-auto grid">
        <h2
          className="my-6 text-2xl font-semibold"
          style={{ color: "#10244b" }}
        >
          Dashboard
        </h2>

        {/* Stats Cards - الكود الأصلي */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Total clients",
              value: counts.clients,
              iconColor: "text-white bg-blue-500",
              svgPath:
                "M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z",
            },
            {
              title: "Total Doctors",
              value: counts.doctors,
              iconColor: "text-white bg-blue-500",
              svgPath:
                "M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z",
              rules: "evenodd",
            },
            {
              title: "Appointments Numbers",
              value: counts.appointments,
              iconColor: "text-white bg-blue-500",
              svgPath:
                "M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
            },
            {
              title: "Total Services",
              value: counts.services,
              iconColor: "text-white bg-blue-500",
              svgPath:
                "M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z",
              rules: "evenodd",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="flex items-center bg-white rounded-lg py-4 px-2"
              style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
            >
              <div className={`p-3 mr-2 rounded-full ${card.iconColor}`}>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d={card.svgPath}
                    fillRule={card.rules || undefined}
                    clipRule={card.rules || undefined}
                  />
                </svg>
              </div>
              <div>
                <p className="text-md font-medium" style={{ color: "#10244b" }}>
                  {card.title}
                </p>
                <p className="text-lg font-semibold text-gray-400">
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Reviews Summary Section - جديد */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FaStar className="text-yellow-500" /> Reviews Summary
          </h3>
          
          {reviewLoading ? (
            <div className="flex justify-center py-8 bg-white rounded-lg shadow">
              <FaSpinner className="animate-spin text-2xl text-blue-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Doctor Reviews */}
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                <div className="flex items-center gap-2 mb-3">
                  <FaUserMd className="text-blue-500 text-xl" />
                  <h4 className="font-semibold text-gray-700">Doctor Reviews</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Approved</span>
                    <span className="font-semibold text-green-600">{approvedDoctors}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pending</span>
                    <span className="font-semibold text-yellow-600">{pendingDoctors}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rejected</span>
                    <span className="font-semibold text-red-600">{rejectedDoctors}</span>
                  </div>
                </div>
              </div>

              {/* Clinic Reviews */}
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
                <div className="flex items-center gap-2 mb-3">
                  <FaClinicMedical className="text-purple-500 text-xl" />
                  <h4 className="font-semibold text-gray-700">Clinic Reviews</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Approved</span>
                    <span className="font-semibold text-green-600">{approvedClinic}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pending</span>
                    <span className="font-semibold text-yellow-600">{pendingClinic}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Role Request Section - الكود الأصلي */}
        <div className="container mx-auto grid">
          <h2
            className="my-6 text-2xl font-semibold"
            style={{ color: "#10244b" }}
          >
            Role Request
          </h2>
          <div className="w-full overflow-hidden rounded-lg shadow-xs">
            <Charts />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Status;