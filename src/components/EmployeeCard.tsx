interface EmployeeCardProps {
  name: string;
  role: string;
  salary: number;
  onDelete: () => void;
}

function EmployeeCard({
  name,
  role,
  salary,
  onDelete,
}: EmployeeCardProps) {
  return (
    <div
      style={{
        border: "1px solid white",
        borderRadius: "10px",
        padding: "20px",
        margin: "20px",
      }}
    >
      <h3>👤 {name}</h3>

      <p>
        <strong>Role :</strong> {role}
      </p>

      <p>
        <strong>Salary :</strong> ₹{salary}
      </p>

      <button
        onClick={onDelete}
        style={{
          backgroundColor: "red",
          color: "white",
          border: "none",
          padding: "8px 15px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Delete
      </button>
    </div>
  );
}

export default EmployeeCard;