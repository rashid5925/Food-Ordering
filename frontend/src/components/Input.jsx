export default function Input({title, id, placeholder, icon, input, setInput, py = "py-3"}) {
  return (
    <>
      <label htmlFor={id} className="mt-4 mb-2 block text-sm font-medium">
        {title}
      </label>
      <div className="relative">
        <input
          type="text"
          id={id}
          name={id}
          className={`w-full rounded-md border border-gray-200 px-4 ${py} pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500`}
          placeholder={placeholder}
          onChange={e => setInput(e)}
          value={input}
          required
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
          {icon}
        </div>
      </div>
    </>
  );
}
