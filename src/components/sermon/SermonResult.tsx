'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SermonResultProps {
  sermonData: {
    title: string;
    introduction: string;
    mainPoints: { title: string; content: string }[];
    conclusion: string;
    scriptureReferences: string[];
    illustrations?: string[];
  };
  onReset: () => void;
}

export default function SermonResult({ sermonData, onReset }: SermonResultProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  return (
    <div className="sermon-container rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-blue-500 p-6 dark:border-gray-700 dark:from-indigo-500 dark:to-blue-400">
        <h2 className="text-2xl font-bold text-white">{sermonData.title}</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {sermonData.scriptureReferences.map((ref, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white"
            >
              {ref}
            </span>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {/* Introduction */}
          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <button
              className="flex w-full items-center justify-between p-4 text-left font-medium text-gray-900 dark:text-white"
              onClick={() => toggleSection('introduction')}
            >
              <span className="text-lg font-semibold">Introduction</span>
              <svg
                className={`h-5 w-5 transition-transform ${
                  activeSection === 'introduction' || activeSection === 'all' ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all ${
                activeSection === 'introduction' || activeSection === 'all' ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">{sermonData.introduction}</p>
              </div>
            </div>
          </div>

          {/* Main Points */}
          {Array.isArray(sermonData.mainPoints) ? (
            sermonData.mainPoints.map((point, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
              >
                <button
                  className="flex w-full items-center justify-between p-4 text-left font-medium text-gray-900 dark:text-white"
                  onClick={() => toggleSection(`point-${index}`)}
                >
                  <span className="text-lg font-semibold">
                    {index + 1}. {point.title || `Point ${index + 1}`}
                  </span>
                  <svg
                    className={`h-5 w-5 transition-transform ${
                      activeSection === `point-${index}` || activeSection === 'all' ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all ${
                    activeSection === `point-${index}` || activeSection === 'all' ? 'max-h-96 overflow-y-auto' : 'max-h-0'
                  }`}
                >
                  <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                    <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">{point.content || 'No content available for this point.'}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <p className="text-gray-700 dark:text-gray-300">No main points available.</p>
            </div>
          )}

          {/* Conclusion */}
          {sermonData.conclusion ? (
            <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
              <button
                className="flex w-full items-center justify-between p-4 text-left font-medium text-gray-900 dark:text-white"
                onClick={() => toggleSection('conclusion')}
              >
                <span className="text-lg font-semibold">Conclusion</span>
                <svg
                  className={`h-5 w-5 transition-transform ${
                    activeSection === 'conclusion' || activeSection === 'all' ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all ${
                  activeSection === 'conclusion' || activeSection === 'all' ? 'max-h-96 overflow-y-auto' : 'max-h-0'
                }`}
              >
                <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                  <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">{sermonData.conclusion}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <p className="text-gray-700 dark:text-gray-300">No conclusion available.</p>
            </div>
          )}

          {/* Illustrations if available */}
          {sermonData.illustrations && sermonData.illustrations.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
              <button
                className="flex w-full items-center justify-between p-4 text-left font-medium text-gray-900 dark:text-white"
                onClick={() => toggleSection('illustrations')}
              >
                <span className="text-lg font-semibold">Illustrations & Examples</span>
                <svg
                  className={`h-5 w-5 transition-transform ${
                    activeSection === 'illustrations' || activeSection === 'all' ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all ${
                  activeSection === 'illustrations' || activeSection === 'all' ? 'max-h-96 overflow-y-auto' : 'max-h-0'
                }`}
              >
                <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                  <ul className="list-inside list-disc space-y-2">
                    {sermonData.illustrations.map((illustration, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">
                        {illustration}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Button
            onClick={onReset}
            className="flex-1 rounded-md bg-gray-100 px-4 py-2 font-medium text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Generate Another Sermon
          </Button>
          <Button
            onClick={() => {
              // Add print-specific styling
              const style = document.createElement('style');
              style.id = 'print-style';
              style.innerHTML = `
                @media print {
                  body * {
                    visibility: hidden;
                  }
                  .print-section, .print-section * {
                    visibility: visible;
                  }
                  .print-section {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                  }
                  .print-header {
                    margin-bottom: 20px;
                    text-align: center;
                  }
                  .print-section button, 
                  .print-section svg, 
                  .print-hide {
                    display: none !important;
                  }
                  .print-section .max-h-0,
                  .print-section .max-h-96 {
                    max-height: none !important;
                    overflow: visible !important;
                  }
                  .print-section .border-t {
                    border-top: 1px solid #e5e7eb !important;
                  }
                  .print-section h2 {
                    font-size: 24px;
                    margin-bottom: 8px;
                  }
                  .print-section h3 {
                    font-size: 18px;
                    margin: 16px 0 8px;
                  }
                  .print-section p {
                    margin-bottom: 8px;
                  }
                }
              `;
              document.head.appendChild(style);
              
              // Set all sections to be expanded for printing
              const currentActiveSection = activeSection;
              setActiveSection('all');
              
              // Add a class to the sermon container for print targeting
              const container = document.querySelector('.sermon-container');
              if (container) {
                container.classList.add('print-section');
              }
              
              // Print the document
              setTimeout(() => {
                window.print();
                
                // Clean up after printing
                setTimeout(() => {
                  document.head.removeChild(style);
                  setActiveSection(currentActiveSection);
                  if (container) {
                    container.classList.remove('print-section');
                  }
                }, 500);
              }, 300);
            }}
            className="flex-1 rounded-md bg-indigo-100 px-4 py-2 font-medium text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
          >
            <span className="flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="mr-2 h-5 w-5"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" 
                />
              </svg>
              Print / Save as PDF
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}