import "../../Pages/Auth/Shared.css";

const ButtonSubmit = ({ name, onClick, disabled }) => {
  return (
    <input
      type="submit"
      value={name}
      className={`_btn ${disabled ? "disabled" : ""}`}
      onClick={onClick}
      disabled={disabled}
    />
  );
};

export default ButtonSubmit;
