export default function LandingPage() {
  const goal = 1000;
  const current = 450;
  const progress = (current / goal) * 100;

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-center">🚀 PRD: Starter Kit</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Offrir un ordinateur à 1000 diplômés méritants chaque année.
      </p>
      
      <div className="w-full max-w-md bg-gray-100 p-6 rounded-xl shadow-sm border">
        <div className="flex justify-between mb-2 font-semibold">
          <span>{current}€ récoltés</span>
          <span>Objectif: {goal}€</span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-4">
          <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </main>
  );
}