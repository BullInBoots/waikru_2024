import dynamic from "next/dynamic";
import React from "react";

const AdminPage = dynamic(() => import("@/src/components/admin/AdminPage"));

const page = () => {
  return <AdminPage />;
};

export default page;
