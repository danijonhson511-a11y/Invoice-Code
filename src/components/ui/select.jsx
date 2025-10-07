import * as React from "react";

const SelectContext = React.createContext();

const Select = ({ children, value, onValueChange }) => {
  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      {children}
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = ({ placeholder }) => {
  const { value } = React.useContext(SelectContext);
  return <span>{value || placeholder}</span>;
};

const SelectContent = ({ children }) => {
  return (
    <div className="mt-1 rounded-md border border-gray-300 bg-white shadow-lg">
      {children}
    </div>
  );
};

const SelectItem = ({ value, children }) => {
  const { onValueChange } = React.useContext(SelectContext);

  return (
    <div
      className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
      onClick={() => onValueChange(value)}
    >
      {children}
    </div>
  );
};

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
