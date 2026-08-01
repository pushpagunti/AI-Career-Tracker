const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 ${className}`}>{children}</div>
);

export default Card;