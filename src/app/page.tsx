import { CalculatorApp } from '@/components/ClientComponents';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <CalculatorApp />
      
      <footer className="mt-16 text-center text-sm text-gray-500">
        <p>AR/3D Calculator - Built with Next.js and Three.js</p>
      </footer>
    </main>
  );
}
