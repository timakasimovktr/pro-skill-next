// import Image from "next/image";
import CourseDashboard from "../../../../components/CourseDashboard.jsx";

export default function Course({params}) {
  return (
    <>
      <CourseDashboard courseId={params.courseId} />
    </>
  );
}