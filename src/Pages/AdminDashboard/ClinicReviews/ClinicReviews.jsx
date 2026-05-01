import React from "react";
import AdminTables from "../AdminTables";

function ClinicReviews() {
  return (
    <main className="h-full overflow-y-auto bg-white">
      <div className="container px-6 mx-auto grid">
        <h2
          className="my-6 text-2xl font-semibold"
          style={{ color: "#10244b" }}
        >
          Clinic Reviews
        </h2>
        <div className="w-full overflow-hidden rounded-lg shadow-xs">
          {/* <AdminTables /> */}
        </div>
      </div>
    </main>
  );
}

export default ClinicReviews;
