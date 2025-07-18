// // import { useState } from 'react';
// // import reactLogo from './assets/react.svg';
// // import viteLogo from '/vite.svg';
// // import './App.css';
// // import LabReportExplainer from './components/LabReportExplainer';
// // import DoctorRecommendation from './components/DoctorRecommendation';


// // function App() {
// //   const [count, setCount] = useState(0);

// //   return (
// //     <div className="min-h-screen bg-gray-100">
// //       <div>
// //         <a href="https://vite.dev" target="_blank">
// //           <img src={viteLogo} className="logo" alt="Vite logo" />
// //         </a>
// //         <a href="https://react.dev" target="_blank">
// //           <img src={reactLogo} className="logo react" alt="React logo" />
// //         </a>
// //       </div>
// //       <h1>Vite + React</h1>
// //       <div className="card">
// //         <button onClick={() => setCount((count) => count + 1)}>
// //           count is {count}
// //         </button>
// //         <p>
// //           Edit <code>src/App.tsx</code> and save to test HMR
// //         </p>
// //       </div>
// //       <p className="read-the-docs">
// //         Click on the Vite and React logos to learn more
// //       </p>

// //       {/* LabReportExplainer component */}
// //       <LabReportExplainer />
// //     </div>
// //   );
// // }

// // export default App;

// import { useState } from 'react';
// import './App.css';
// import LabReportExplainer from './components/LabReportExplainer';
// import DoctorRecommendation from './components/DoctorRecommendation';

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <h1 className="text-3xl font-bold text-center mb-6">Lab Report Explainer</h1>

//       {/* Lab Report Section */}
//       <LabReportExplainer />

//       <hr className="my-8 border-gray-300" />

//       {/* Doctor Recommendation Section */}
//       <DoctorRecommendation />
//     </div>
//   );
// }

// export default App;

import { useState } from 'react';
import './App.css';
import LabReportExplainer from './components/LabReportExplainer';
import DoctorRecommendation from './components/DoctorRecommendation';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Lab Report Explainer & Doctor Finder</h1>

      <LabReportExplainer />

      <hr className="my-8 border-gray-300" />

      <DoctorRecommendation />
    </div>
  );
}

export default App;
