const CourseId = ({ params }: {params: { courseId: string}}) => {
    return ( 
    <div>
        <h1>Course ID: {params.courseId}</h1>
    </div>
     );
}
 
export default CourseId;