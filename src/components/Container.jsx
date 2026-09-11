const Container = ({ children, className = '' }) => (
  <div className={`mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16 ${className}`}>
    {children}
  </div>
)

export default Container
