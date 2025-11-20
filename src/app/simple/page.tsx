export default function SimplePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎉 Supabase + Clerk Setup Complete!
        </h1>
        <div className="space-y-4">
          <div className="p-4 bg-green-100 rounded-lg">
            <h2 className="font-semibold text-green-800">✅ Environment Variables</h2>
            <p className="text-sm text-green-700">
              Supabase and Clerk keys are configured
            </p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg">
            <h2 className="font-semibold text-blue-800">📋 Next Steps</h2>
            <ol className="text-sm text-blue-700 list-decimal list-inside space-y-1">
              <li>Go to your Supabase dashboard</li>
              <li>Run the SQL schema in SQL Editor</li>
              <li>Test the full application</li>
            </ol>
          </div>
          <div className="p-4 bg-yellow-100 rounded-lg">
            <h2 className="font-semibold text-yellow-800">🔗 Links</h2>
            <div className="text-sm text-yellow-700 space-y-1">
              <div>
                <strong>Supabase:</strong> 
                <a 
                  href="https://supabase.com/dashboard/project/pefchyjzvnfavwaylidh" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  Open Dashboard
                </a>
              </div>
              <div>
                <strong>Test Page:</strong> 
                <a 
                  href="/test" 
                  className="text-blue-600 hover:underline ml-1"
                >
                  /test
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
