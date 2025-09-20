export default function CreateTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Create Page Test</h1>
      <p>If you can see this, the create route is working.</p>
      <form>
        <input type="text" placeholder="Test input" className="border p-2" />
        <button type="button" className="bg-blue-500 text-white p-2 ml-2">Test Button</button>
      </form>
    </div>
  );
}
