interface EmployeeCardProps {
  index: number;
  name: string;
  role: string;
  salary: number;
  onDelete: () => void;
  onEdit: () => void;
}

function EmployeeCard({
  index,
  name,
  role,
  salary,
  onDelete,
  onEdit,
}: EmployeeCardProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const formattedSalary = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(salary);

  return (
    <article
      className="employee-card"
      style={{ animationDelay: `${Math.min(index * 80, 420)}ms` }}
    >
      <div className="employee-card__topline">
        <span className="employee-card__badge">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="employee-card__status">Active</span>
      </div>

      <div className="employee-card__top">
        <div className="employee-avatar">{initials || "EM"}</div>
        <div>
          <h3>{name}</h3>
          <p className="employee-role">{role}</p>
        </div>
      </div>

      <div className="employee-card__stats">
        <span>Compensation</span>
        <strong>{formattedSalary}</strong>
      </div>

      <div className="employee-card__actions">
        <button className="edit-button" onClick={onEdit} type="button">
          Edit
        </button>
        <button className="delete-button" onClick={onDelete} type="button">
          Remove
        </button>
      </div>
    </article>
  );
}

export default EmployeeCard;
