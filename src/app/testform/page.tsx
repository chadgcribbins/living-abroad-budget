'use client';

export default function TestFormPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert('Test page form submitted!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Form Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="testInput">Test Input:</label>
        <input type="text" id="testInput" name="testInput" style={{ border: '1px solid black', marginLeft: '5px', marginRight: '10px' }} />
        <button type="submit" style={{ border: '1px solid black', padding: '5px' }}>Submit Test Form</button>
      </form>
    </div>
  );
} 