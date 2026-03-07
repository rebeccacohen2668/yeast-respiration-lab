import React, { useState } from 'react';


// --- Custom CSS for Animations ---
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;600;800&display=swap');
  
  @keyframes drop-fall {
    0% { transform: translate(-50%, -10px) scale(0.5); opacity: 0; }
    20% { transform: translate(-50%, 0px) scale(1); opacity: 1; }
    80% { transform: translate(-50%, 70px) scale(1); opacity: 1; }
    100% { transform: translate(-50%, 80px) scale(0.5); opacity: 0; }
  }


  @keyframes disk-drop {
    0% { transform: translate(-50%, -10px); opacity: 1; }
    80% { transform: translate(-50%, 55px); opacity: 1; }
    100% { transform: translate(-50%, 75px); opacity: 0; }
  }


  .falling-drop {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translate(-50%, -10px);
    opacity: 0;
    width: 10px;
    height: 14px;
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    animation: drop-fall 0.45s linear forwards;
    z-index: 20;
  }
  
  .drop-base { background-color: #38bdf8; }
  .drop-acid { background-color: #fbbf24; }
  .drop-indicator { background-color: #e2e8f0; border: 1px solid #cbd5e1; }
  .drop-water { background-color: #bae6fd; }
  .drop-ethanol { background-color: #d8b4fe; }
  .drop-glucose { background-color: #86efac; }
  .drop-mixed { background-color: #93c5fd; }
  
  .pipette-tip {
    position: relative;
    width: 10px;
    height: 55px;
    background: linear-gradient(to bottom, #cbd5e1, #f8fafc);
    border: 1px solid #94a3b8;
    border-radius: 0 0 5px 5px;
    z-index: 40;
    transition: all 0.4s ease-in-out;
  }


  .pipette-liquid {
    position: absolute;
    bottom: 2px;
    left: 1px;
    right: 1px;
    border-radius: 0 0 3px 3px;
    transition: height 0.4s ease-in-out;
  }


  .tube-liquid {
    width: 100%;
    transition: height 0.8s ease-in-out, background-color 0.8s ease-in-out;
  }


  .water-bath {
    background: linear-gradient(to bottom, rgba(14, 165, 233, 0.4), rgba(2, 132, 199, 0.7));
    border: 4px solid #7dd3fc;
    border-top: 2px dashed #38bdf8;
    border-radius: 0 0 20px 20px;
    backdrop-filter: blur(1px);
  }


  .straw {
    position: absolute;
    width: 10px;
    height: 80px;
    background: linear-gradient(to right, #f8fafc, #cbd5e1);
    border: 1px solid #94a3b8;
    border-radius: 2px 2px 0 0;
    z-index: 40;
    transition: all 0.3s ease-in-out;
  }


  .spoon {
    position: absolute;
    width: 75px;
    height: 24px;
    z-index: 40;
    transition: all 0.3s ease-in-out;
    transform-origin: right center;
  }
`;


const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));


// --- Sub-Component: Classification Table ---
const ClassificationTable = ({ qNum, question, rows, options, correctAnswers, explanation }) => {
  const [selections, setSelections] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);


  const handleSelect = (rowIdx, optIdx) => {
    if (!isSubmitted) setSelections({ ...selections, [rowIdx]: optIdx });
  };


  const isAllCorrect = rows.every((_, i) => selections[i] === correctAnswers[i]);


  return (
    <div className="border border-stone-200 rounded-lg p-4 md:p-6 mb-8 bg-white shadow-sm text-right">
      <div className="font-bold text-base md:text-lg mb-5 text-stone-800 leading-snug text-right">
        שאלה {qNum}: <span className="font-normal">{question}</span>
      </div>
      <div className="w-full mb-6 pb-2">
        <table className="w-full border-collapse border border-stone-300 text-[10px] sm:text-xs md:text-sm table-fixed">
          <thead>
            <tr className="bg-stone-100">
              <th className="p-1 md:p-3 border border-stone-300 w-1/3 text-right">מרכיב הניסוי</th>
              {options.map((opt, i) => (
                <th key={i} className="p-1 md:p-3 border border-stone-300 text-center break-words">{opt}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                <td className="p-1 md:p-3 border border-stone-300 font-bold bg-stone-50 text-right text-stone-800 pr-2">{row}</td>
                {options.map((_, optIdx) => (
                  <td 
                    key={optIdx} 
                    className={`p-1 md:p-3 border border-stone-300 text-center cursor-pointer transition-colors ${
                      isSubmitted 
                        ? (optIdx === correctAnswers[rowIdx] ? 'bg-emerald-100' : (selections[rowIdx] === optIdx ? 'bg-rose-100' : ''))
                        : (selections[rowIdx] === optIdx ? 'bg-sky-100' : 'hover:bg-stone-50')
                    }`}
                    onClick={() => handleSelect(rowIdx, optIdx)}
                  >
                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 mx-auto flex items-center justify-center transition-all ${
                      selections[rowIdx] === optIdx ? 'border-sky-600 bg-sky-600' : 'border-stone-400'
                    } ${isSubmitted ? (optIdx === correctAnswers[rowIdx] ? 'border-emerald-600 bg-emerald-600' : selections[rowIdx] === optIdx ? 'border-rose-600 bg-rose-600' : '') : ''}`}>
                      {selections[rowIdx] === optIdx && <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full"></div>}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!isSubmitted ? (
        <button 
          onClick={() => Object.keys(selections).length === rows.length && setIsSubmitted(true)} 
          disabled={Object.keys(selections).length < rows.length}
          className="px-6 py-2 md:px-8 md:py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 text-sm md:text-base"
        >
          בדוק תשובות
        </button>
      ) : (
        <div className={`p-4 rounded-xl border-2 ${isAllCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
          <h4 className={`font-bold mb-2 text-sm md:text-base ${isAllCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
            {isAllCorrect ? '✓ כל הכבוד! כל הסיווגים נכונים.' : '✗ חלק מהסיווגים אינם נכונים. ראו הסבר:'}
          </h4>
          <p className="text-stone-800 text-xs md:text-[15px]">{explanation}</p>
        </div>
      )}
    </div>
  );
};


// --- Multiple Choice Question Component ---
const MultipleChoiceQnA = ({ qNum, question, options, correctAnswerIndex, explanation }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);


  const handleOptionSelect = (index) => {
    if (!isSubmitted) setSelectedOption(index);
  };


  const handleSubmit = () => {
    if (selectedOption !== null) setIsSubmitted(true);
  };


  const isCorrect = selectedOption === correctAnswerIndex;


  return (
    <div className="border border-stone-200 rounded-lg p-4 md:p-6 mb-8 bg-white shadow-sm hover:shadow-md transition-shadow text-right">
      <div className="font-bold text-base md:text-lg mb-5 text-stone-800 leading-snug">
        שאלה {qNum}: <span className="font-normal whitespace-pre-line">{question}</span>
      </div>
      <div className="flex flex-col gap-3 mb-5 text-right">
        {options.map((option, index) => {
          let btnClass = "text-right p-3 md:p-4 rounded-lg border-2 text-stone-700 transition-colors duration-200 focus:outline-none ";
          if (!isSubmitted) {
              btnClass += selectedOption === index ? "bg-emerald-50 border-emerald-400 font-bold shadow-sm" : "bg-stone-50 hover:bg-stone-100 border-stone-200";
          } else {
            if (index === correctAnswerIndex) {
              btnClass += "bg-emerald-100 border-emerald-500 font-bold text-emerald-900";
            } else if (index === selectedOption) {
              btnClass += "bg-rose-50 border-rose-400 font-bold text-rose-800";
            } else {
              btnClass += "bg-stone-50 border-stone-200 opacity-50";
            }
          }
          return (
            <button key={index} onClick={() => handleOptionSelect(index)} disabled={isSubmitted} className={btnClass}>
              <div className="flex items-center gap-3 md:gap-4">
                <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  isSubmitted ? (index === correctAnswerIndex ? 'border-emerald-500 bg-emerald-500' : (index === selectedOption ? 'border-rose-500 bg-rose-500' : 'border-stone-300')) : (selectedOption === index ? 'border-emerald-500 bg-emerald-500' : 'border-stone-400')
                }`}>
                  {isSubmitted && index === correctAnswerIndex && <span className="text-white text-[10px] md:text-xs">✓</span>}
                  {isSubmitted && index === selectedOption && index !== correctAnswerIndex && <span className="text-white text-[10px] md:text-xs">✗</span>}
                </div>
                <span className="text-sm md:text-[15px] leading-relaxed">{option}</span>
              </div>
            </button>
          );
        })}
      </div>
      {!isSubmitted && (
        <button onClick={handleSubmit} disabled={selectedOption === null} className="px-6 py-2 md:px-8 md:py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors text-right text-sm md:text-base">
          בדוק תשובה
        </button>
      )}
      {isSubmitted && (
        <div className={`mt-4 p-4 md:p-5 rounded-xl border-2 ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
          <h4 className={`font-bold mb-2 text-sm md:text-base ${isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
            {isCorrect ? '✓ כל הכבוד! תשובה נכונה.' : '✗ תשובה שגויה. הסבר:'}
          </h4>
          <div className="text-stone-800 whitespace-pre-line leading-relaxed text-xs md:text-[15px]">
            {explanation}
          </div>
        </div>
      )}
    </div>
  );
};


// --- Part A: Initial Test ---
const PartA = () => {
  const [stage, setStage] = useState(0); 
  const [activeDrops, setActiveDrops] = useState({ a: [], b: [], c: [] });
  const [isAnimating, setIsAnimating] = useState({ a: false, b: false, c: false });
  const [isPink, setIsPink] = useState({ a: false, b: false, c: false });
  const [tableData, setTableData] = useState({ a: { baseI: '-', acidI: '-', colorI: '', baseII: '-' }, b: { baseI: '-', acidI: '-', colorI: '', baseII: '-' }, c: { baseI: '-', acidI: '-', colorI: '', baseII: '-' } });


  const isAnyAnimating = isAnimating.a || isAnimating.b || isAnimating.c;


  const triggerDrops = (config, onComplete) => {
    let maxCount = 0;
    Object.keys(config).forEach(k => { if(config[k]) maxCount = Math.max(maxCount, config[k].count); });
    
    let currentTick = 0;
    const animatingState = { a: false, b: false, c: false };
    Object.keys(config).forEach(k => { if (config[k] && config[k].count > 0) animatingState[k] = true; });
    setIsAnimating(animatingState);
    
    const interval = setInterval(() => {
      currentTick++;
      Object.keys(config).forEach(tube => {
         if (config[tube] && currentTick <= config[tube].count) {
           setActiveDrops(prev => ({ ...prev, [tube]: [...prev[tube], { id: Date.now() + Math.random(), type: config[tube].type }] }));
         }
      });
      if (currentTick >= maxCount) {
         clearInterval(interval);
         setTimeout(() => { setIsAnimating({ a: false, b: false, c: false }); onComplete(); }, 600);
      }
    }, 500);
  };


  const resetPartA = () => {
    setStage(0); setActiveDrops({ a: [], b: [], c: [] });
    setIsAnimating({ a: false, b: false, c: false }); setIsPink({ a: false, b: false, c: false });
    setTableData({ a: { baseI: '-', acidI: '-', colorI: '', baseII: '-' }, b: { baseI: '-', acidI: '-', colorI: '', baseII: '-' }, c: { baseI: '-', acidI: '-', colorI: '', baseII: '-' } });
  };


  return (
    <div className="mb-16 text-right">
      <div className="flex items-center gap-3 mb-6 border-b-2 border-emerald-200 pb-3">
        <h2 className="text-xl md:text-2xl font-bold text-emerald-900">חלק א' - הכרת שיטת המדידה</h2>
      </div>
      <div className="bg-emerald-50/70 p-4 md:p-6 rounded-2xl mb-6 border border-emerald-100 shadow-sm text-stone-800 leading-relaxed text-right">
        <h3 className="font-bold text-emerald-900 mb-3 text-base md:text-lg">📋 שלב א: הכרת תכונות חומר הבוחן פנול-פתלאין</h3>
        <p className="text-sm md:text-[16px] mb-2">
          בשלב זה נכיר את שיטת המדידה. נכין מבחנות עם מים מזוקקים ואינדיקטור, נטפטף חומצה או בסיס, ולאחר מכן נבצע טיטרציה.
        </p>
        <p className="text-emerald-800 font-bold text-sm md:text-base mt-2">הפעילו את שלבי האנימציה ועקבו אחר ההנחיות המופיעות בה:</p>
      </div>
      <div className="bg-white border-2 border-stone-100 p-3 md:p-5 rounded-2xl mb-8 shadow-sm text-right">
        <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-2 mb-2 bg-stone-50 p-2 md:p-3 rounded-xl border border-stone-200">
          <button onClick={() => {
            setStage(1);
            triggerDrops({a:{count:2,type:'indicator'},b:{count:2,type:'indicator'},c:{count:2,type:'indicator'}}, ()=> {
              setTableData(p=>({...p,a:{...p.a,colorI:'חסר צבע'},b:{...p.b,colorI:'חסר צבע'},c:{...p.c,colorI:'חסר צבע'}}));
            });
          }} disabled={stage!==0||isAnyAnimating} className="w-full md:w-auto px-1 py-2 sm:px-3 md:px-5 md:py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg shadow-sm transition-all text-[13px] sm:text-sm md:text-[15px] flex items-center justify-center text-center leading-tight">1. הוסף אינדיקטור</button>
          <button onClick={async () => {
            setStage(2);
            triggerDrops({b:{count:1,type:'acid'}, c:{count:3,type:'acid'}}, async () => {
              await wait(1000);
              triggerDrops({a:{count:3,type:'base'}}, () => {
                setIsPink(p=>({...p,a:true}));
                setTableData(p=>({...p, a:{...p.a,baseI:'3',acidI:'-',colorI:'ורוד'}, b:{...p.b,baseI:'-',acidI:'1',colorI:'חסר צבע'}, c:{...p.c,baseI:'-',acidI:'3',colorI:'חסר צבע'} }));
              });
            });
          }} disabled={stage!==1||isAnyAnimating} className="w-full md:w-auto px-1 py-2 sm:px-3 md:px-5 md:py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg shadow-sm transition-all text-[13px] sm:text-sm md:text-[15px] flex items-center justify-center text-center leading-tight">2. חומצה/בסיס</button>
          <button onClick={() => {
            setStage(3);
            triggerDrops({b:{count:2,type:'base'},c:{count:4,type:'base'}}, ()=> {
              setTableData(p=>({...p,b:{...p.b,baseII:'2'},c:{...p.c,baseII:'4'}}));
            });
            setTimeout(() => setIsPink(p=>({...p, b: true})), 1200); 
            setTimeout(() => setIsPink(p=>({...p, c: true})), 2400);
          }} disabled={stage!==2||isAnyAnimating} className="w-full md:w-auto px-1 py-2 sm:px-3 md:px-5 md:py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-lg shadow-sm transition-all text-[13px] sm:text-sm md:text-[15px] flex items-center justify-center text-center leading-tight">3. טיטרציה (שלב II)</button>
          <button onClick={resetPartA} className="w-full md:w-auto px-1 py-2 sm:px-3 md:px-5 md:py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-lg shadow-sm transition-all text-[13px] sm:text-sm md:text-[15px] flex items-center justify-center text-center leading-tight gap-1.5"><span>↺</span> מחדש</button>
        </div>
        
        <div className="relative w-full max-w-4xl mx-auto border border-stone-100 rounded-xl bg-slate-50 shadow-inner overflow-hidden flex justify-center items-end h-[220px] sm:h-[240px] md:h-[280px] pb-2 pt-14 md:pt-16">
          <div className="absolute top-0 left-0 w-full bg-emerald-100/90 border-b border-emerald-200 p-2 z-40 text-center shadow-sm min-h-[44px] flex items-center justify-center transition-all duration-300">
            <p className="text-xs md:text-sm text-emerald-900 px-2 leading-snug">
              {stage === 0 && "לחצו על השלבים למעלה כדי להתחיל בניסוי (הוספת אינדיקטור)."}
              {stage === 1 && <span><strong>הוספת אינדיקטור:</strong> הכנו שלוש מבחנות עם מים מזוקקים והוספנו 2 טיפות אינדיקטור פנול-פתלאין לכל אחת.</span>}
              {stage === 2 && <span><strong>חומצה/בסיס:</strong> נטפטף חומצה (HCl) למבחנות ב' ו-ג', ולאחר מכן בסיס (NaOH) למבחנה א'.</span>}
              {stage === 3 && <span><strong>טיטרציה:</strong> נטפטף בסיס (NaOH) למבחנות ב' ו-ג' ונמדוד כמה בסיס דרוש לסתירת החומצה.</span>}
            </p>
          </div>
          <div className="flex justify-center items-end gap-8 md:gap-16 scale-75 sm:scale-90 md:scale-100 origin-bottom w-full">
            {['a', 'b', 'c'].map(tube => (
              <div key={tube} className="flex flex-col items-center relative w-16 text-right">
                <div className={`absolute bottom-full mb-2 flex flex-col items-center justify-end transition-opacity duration-300 w-full min-h-[55px] ${isAnimating[tube] ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="pipette-tip relative">
                    {activeDrops[tube].length > 0 && <div className={`pipette-liquid ${activeDrops[tube][0].type === 'indicator' ? 'bg-slate-200' : activeDrops[tube][0].type === 'acid' ? 'bg-amber-400' : 'bg-sky-400'}`} style={{ height: '60%' }}></div>}
                  </div>
                  {activeDrops[tube].map(drop => <div key={drop.id} className={`falling-drop drop-${drop.type}`}></div>)}
                </div>
                <div className="w-14 h-36 border-x-[5px] border-b-[5px] border-stone-300 relative bg-stone-50 overflow-hidden shadow-inner mt-2" style={{ borderBottomLeftRadius: '1.75rem', borderBottomRightRadius: '1.75rem' }}>
                  <div className="tube-liquid absolute bottom-0" style={{ height: '50%', backgroundColor: isPink[tube] ? '#f9a8d4' : 'rgba(226, 232, 240, 0.6)' }}></div>
                </div>
                <span className="mt-4 font-bold text-stone-700 bg-stone-100 px-3 py-1 rounded-md text-sm border border-stone-200 whitespace-nowrap">מבחנה {tube === 'a' ? 'א\'' : tube === 'b' ? 'ב\'' : 'ג\''}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-full mt-2 md:mt-3 text-right">
          <table className="w-full text-center border-collapse bg-white shadow-sm border border-stone-300 text-[10px] sm:text-xs md:text-sm">
            <thead className="bg-stone-100 border-b-2 border-stone-300 text-stone-700 font-bold">
              <tr><th className="p-1 md:p-2 border-x" rowSpan="2">המבחנה</th><th className="p-1 md:p-2 border-x" colSpan="3">שלב I</th><th className="p-1 md:p-2 border-x">שלב II</th></tr>
              <tr className="bg-stone-50 text-[10px] sm:text-xs text-stone-600">
                <th className="p-1 border-x break-words">נפח בסיס NaOH (טיפות)</th><th className="p-1 border-x break-words">נפח חומצה HCl (טיפות)</th><th className="p-1 border-x break-words">צבע התמיסה</th><th className="p-1 border-x break-words">טיפות בסיס לקבלת ורוד</th>
              </tr>
            </thead>
            <tbody>
              {['a', 'b', 'c'].map((tube, idx) => (
                <tr key={tube} className="border-b border-stone-200">
                  <td className="p-1 md:p-2 border-x font-bold text-stone-800">{idx === 0 ? 'א\'' : idx === 1 ? 'ב\'' : 'ג\''}</td>
                  <td className="p-1 md:p-2 border-x font-mono">{tableData[tube].baseI}</td><td className="p-1 md:p-2 border-x font-mono">{tableData[tube].acidI}</td>
                  <td className={`p-1 md:p-2 border-x font-bold break-words ${tableData[tube].colorI === 'ורוד' ? 'text-pink-600' : 'text-stone-400'}`}>{tableData[tube].colorI}</td>
                  <td className="p-1 md:p-2 border-x font-mono text-sky-800 font-bold text-sm md:text-lg">{tableData[tube].baseII}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <MultipleChoiceQnA qNum="1" question="על פי התצפיות והטבלה, מהו צבע האינדיקטור פנול-פתלאין בסביבה בסיסית ובסביבה חומצית?" options={["בסביבה בסיסית הצבע ורוד ובסביבה חומצית הוא חסר צבע.","בסביבה בסיסית הצבע חסר צבע ובסביבה חומצית הוא ורוד.","בשתי הסביבות הצבע נשאר ורוד אך בעוצמות שונות לחלוטין.","בסביבה בסיסית הצבע כחול ובסביבה חומצית הוא צהוב בהיר."]} correctAnswerIndex={0} explanation="במבחנה א' (בסיס) הצבע הפך לוורוד. במבחנות ב' ו-ג' (חומצה) הצבע נותר שקוף." />
      <MultipleChoiceQnA qNum="2" question="הסבירו מדוע במבחנה ג' נדרש מספר גדול יותר של טיפות בסיס (NaOH) מאשר במבחנה ב' בשלב II?" options={["מפני שבמבחנה ג' הוספו 3 טיפות חומצה, לעומת טיפה אחת בלבד במבחנה ב'.","מפני שבמבחנה ג' הוספו פחות מים ולכן ריכוז החומצה היה נמוך יותר.","מפני שהבסיס במבחנה ג' היה מרוכז יותר ולכן נדרשו יותר טיפות לסתירה.","מפני שהאינדיקטור פנול-פתלאין מתפרק מהר יותר בנוכחות חומצה HCl."]} correctAnswerIndex={0} explanation="הבסיס סותר את החומצה. ככל שיש יותר חומצה בתמיסה (3 טיפות לעומת 1), נדרשת כמות גדולה יותר של בסיס כדי לנטרול אותה." />
    </div>
  );
};


// --- Part B Component ---
const PartB = () => {
  const [isSeqAnimating, setIsSeqAnimating] = useState(false);
  const [prepStage, setPrepStage] = useState(0);
  const [prepTimer, setPrepTimer] = useState(0);
  const [tubesY, setTubesY] = useState(0); 
  const [tubesData, setTubesData] = useState([{id:1,water:0,eth:0,gluc:0,disks:0,stopper:false},{id:2,water:0,eth:0,gluc:0,disks:0,stopper:false},{id:3,water:0,eth:0,gluc:0,disks:0,stopper:false},{id:4,water:0,eth:0,gluc:0,disks:0,stopper:false}]);
  const [pipetteState, setPipetteState] = useState({ tubeId: null, y: -60, type: 'water', liquidHeight: '0%', dropping: false });
  const [spoonState, setSpoonState] = useState({ tubeId: null, rotated: false, dropping: false });
  const [prepTable, setPrepTable] = useState([{id:1,water:'-',eth:'-',disks:'-',gluc:'-',time:'-'},{id:2,water:'-',eth:'-',disks:'-',gluc:'-',time:'-'},{id:3,water:'-',eth:'-',disks:'-',gluc:'-',time:'-'},{id:4,water:'-',eth:'-',disks:'-',gluc:'-',time:'-'}]);
  const [showWaste, setShowWaste] = useState(false);
  const [wasteHeight, setWasteHeight] = useState('5%');
  const [agarHoles, setAgarHoles] = useState([]);
  const [towelDisks, setTowelDisks] = useState([]);
  const [strawPos, setStrawPos] = useState({ right: 80, bottom: 250, visible: false });


  const [titrStage, setTitrStage] = useState(0);
  const [titrLiquidHeight, setTitrLiquidHeight] = useState({ a: '0%', b: '0%', c: '0%', d: '0%' });
  const [titrPink, setTitrPink] = useState({ a: false, b: false, c: false, d: false });
  const [activeTitrDrops, setActiveTitrDrops] = useState({ a: [], b: [], c: [], d: [] });
  const [titrTable, setTitrTable] = useState([{id:'A1',transfer:'-',ind:'-',base:'-'},{id:'B1',transfer:'-',ind:'-',base:'-'},{id:'C1',transfer:'-',ind:'-',base:'-'},{id:'D1',transfer:'-',ind:'-',base:'-'}]);
  const [titrPipette, setTitrPipette] = useState({ visible: false, tubeId: null, dropping: false, type: 'mixed' });


  const isAnyAnimating = isSeqAnimating;


  const runPrepStep1 = async () => { 
    setIsSeqAnimating(true); setPrepStage(1); 
    setAgarHoles([]); setTowelDisks([]);
    const holes = [{top:20,left:35},{top:30,left:55},{top:15,left:75},{top:35,left:95},{top:25,left:115}];
    for(let i=0; i<5; i++) {
      setStrawPos({ right: 80, bottom: 200, visible: true }); await wait(300);
      setStrawPos({ right: 80, bottom: 80, visible: true }); 
      setAgarHoles(prev => [...prev, holes[i]]); await wait(300);
      setStrawPos({ right: 80, bottom: 200, visible: true }); await wait(250);
      setStrawPos({ right: 320, bottom: 200, visible: true }); await wait(400);
      setStrawPos({ right: 320, bottom: 80, visible: true }); 
      setTowelDisks(prev => [...prev, i]); await wait(250);
      setStrawPos({ right: 320, bottom: 200, visible: true }); await wait(250);
    }
    setStrawPos({ right: 80, bottom: 300, visible: false });
    setIsSeqAnimating(false); 
  };


  const runPrepStep2 = async () => {
    setIsSeqAnimating(true); setPrepStage(2);
    const addLiq = async (idx, type, h, val, prop) => {
      setPipetteState({ tubeId: idx+1, y: -40, type, liquidHeight: '0%', dropping: false }); await wait(400);
      setPipetteState({ tubeId: idx+1, y: -10, type, liquidHeight: '0%', dropping: true }); await wait(400);
      setTubesData(p => { const n = [...p]; n[idx][prop] = h; return n; }); await wait(600);
      setPrepTable(p => { const n = [...p]; n[idx][prop] = val; return n; });
      setPipetteState({ tubeId: idx+1, y: -40, type, liquidHeight: '0%', dropping: false }); await wait(300);
    };
    await addLiq(0, 'water', 25, '5', 'water'); await addLiq(1, 'water', 40, '9', 'water'); await addLiq(2, 'water', 40, '9', 'water'); await addLiq(3, 'ethanol', 25, '4.5', 'eth');
    setPipetteState({ tubeId: null, y: -60, type: 'water', liquidHeight: '0%', dropping: false }); setIsSeqAnimating(false);
  };


  const runPrepStep3 = async () => {
    setIsSeqAnimating(true); setPrepStage(3); setPrepTimer(0);
    for(let i=0; i<4; i++) {
       setSpoonState({ tubeId: i+1, rotated: false, dropping: false }); await wait(300);
       setSpoonState({ tubeId: i+1, rotated: true, dropping: true }); await wait(400); 
       setTubesData(p => { const n = [...p]; n[i].disks = 8; return n; }); await wait(200);
       setSpoonState({ tubeId: null, rotated: false, dropping: false }); await wait(200);
    }
    setTubesData(p => p.map(t => ({...t, stopper: true}))); // ADD STOPPERS
    setPrepTable(p => p.map(row => ({...row, disks: '8'}))); await wait(500);
    setTubesY(30); await wait(1000);
    for(let i=1; i<=6; i++) { setPrepTimer(i); if(i===6) setPrepTable(p => p.map(row => ({...row, time: '6 דק\''}))); await wait(600); }
    setIsSeqAnimating(false);
  };


  const runPrepStep4 = async () => {
    setIsSeqAnimating(true); setPrepStage(4); setTubesY(0); 
    setTubesData(p => p.map(t => ({...t, stopper: false})));
    await wait(1200);
    const glucoseAct = async (id, h, tableIdx, tableVal) => {
       setPipetteState({ tubeId: id, y: -40, type: 'glucose', liquidHeight: '80%', dropping: false }); await wait(400);
       setPipetteState({ tubeId: id, y: -10, type: 'glucose', liquidHeight: '0%', dropping: true }); await wait(500); // IN TUBE
       setTubesData(p => { const n = [...p]; n[tableIdx].gluc = h; return n; });
       setPrepTable(p => { const n = [...p]; n[tableIdx].gluc = tableVal; return n; }); await wait(500);
    };
    await glucoseAct(4, 25, 3, 'הוספת 4.5 מ"ל'); 
    await glucoseAct(1, 25, 0, 'הוספת 5 מ"ל');
    
    const transfer = async (from, to, val) => {
       setPipetteState({ tubeId: from, y: 155, type: 'glucose', liquidHeight: '0%', dropping: false }); await wait(500); 
       setPipetteState({ tubeId: from, y: 155, type: 'glucose', liquidHeight: '80%', dropping: false }); await wait(500);
       setPipetteState({ tubeId: to, y: -10, type: 'glucose', liquidHeight: '0%', dropping: true }); await wait(600); // IN TUBE
       setTubesData(p => { const n = [...p]; n[to-1].gluc = 10; return n; });
       setPrepTable(p => { const n = [...p]; n[to-1].gluc = val; return n; });
    };
    await transfer(1, 2, 'העברת 1 מ"ל ממבחנה 1'); 
    await transfer(2, 3, 'העברת 1 מ"ל ממבחנה 2');
    
    setShowWaste(true); setWasteHeight('5%'); await wait(500);
    setPipetteState({ tubeId: 3, y: 155, type: 'glucose', liquidHeight: '0%', dropping: false }); await wait(500);
    setPipetteState({ tubeId: 3, y: 155, type: 'glucose', liquidHeight: '80%', dropping: false }); await wait(500);
    setPipetteState({ tubeId: 'waste', y: -10, type: 'glucose', liquidHeight: '0%', dropping: true }); 
    setWasteHeight('30%'); await wait(600); // IN WASTE
    setPipetteState({ tubeId: null, y: -60, type: 'glucose', liquidHeight: '0%', dropping: false }); 
    await wait(500);
    setShowWaste(false);
    
    setTubesData(p => p.map(t => ({...t, stopper: true}))); 
    setTubesY(30); setPrepTimer(0); await wait(1000);
    for(let i=1; i<=10; i++) { setPrepTimer(i); if(i===10) setPrepTable(p => p.map(row => ({...row, time: '16 דק\''}))); await wait(600); }
    setIsSeqAnimating(false);
  };
  
  const handleTitrStep1 = () => { setTitrStage(1); };
  const handleTitrStep2 = async () => {
    setIsSeqAnimating(true); setTitrStage(2);
    for (let idx of ['a', 'b', 'c', 'd']) {
        setTitrPipette({ visible: true, tubeId: idx, dropping: false, type: 'mixed' }); await wait(300);
        setTitrPipette({ visible: true, tubeId: idx, dropping: true, type: 'mixed' });
        setTitrLiquidHeight(p => ({...p, [idx]: '35%'})); await wait(600);
        setTitrTable(p => {
          const newP = [...p];
          const i = idx === 'a' ? 0 : idx === 'b' ? 1 : idx === 'c' ? 2 : 3;
          newP[i].transfer = `ממבחנה ${i + 1}`; return newP;
        });
        setTitrPipette({ visible: true, tubeId: idx, dropping: false, type: 'mixed' }); await wait(200);
    }
    setTitrPipette({ visible: false, tubeId: null, dropping: false, type: 'mixed' }); setIsSeqAnimating(false);
  };
  const handleTitrStep3 = async () => {
    setIsSeqAnimating(true); setTitrStage(3);
    for (let idx of ['a', 'b', 'c', 'd']) {
        setTitrPipette({ visible: true, tubeId: idx, dropping: false, type: 'indicator' }); await wait(300);
        setTitrPipette({ visible: true, tubeId: idx, dropping: true, type: 'indicator' }); await wait(600);
        setTitrTable(p => {
          const newP = [...p];
          const i = idx === 'a' ? 0 : idx === 'b' ? 1 : idx === 'c' ? 2 : 3;
          newP[i].ind = '2'; return newP;
        });
    }
    setTitrPipette({ visible: false, tubeId: null, dropping: false, type: 'indicator' }); setIsSeqAnimating(false);
  };
  const handleTitrStep4 = () => {
    setTitrStage(4); const targets = { a: 13, b: 8, c: 4, d: 3 };
    ['a', 'b', 'c', 'd'].forEach(tube => {
      let count = 0; const interval = setInterval(() => {
        if (count < targets[tube]) {
          count++; setActiveTitrDrops(prev => ({ ...prev, [tube]: [...prev[tube], count] }));
          setTitrTable(p => { const n = [...p]; const i = tube === 'a' ? 0 : tube === 'b' ? 1 : tube === 'c' ? 2 : 3; n[i].base = count; return n; });
          if (count === targets[tube]) { setTimeout(() => setTitrPink(prev => ({ ...prev, [tube]: true })), 300); }
        } else clearInterval(interval);
      }, 350);
    });
  };


  const resetPartB = () => { 
    setPrepStage(0); setPrepTimer(0); setTubesY(0); setShowWaste(false); setWasteHeight('5%'); setTitrStage(0);
    setTubesData([{id:1,water:0,eth:0,gluc:0,disks:0,stopper:false},{id:2,water:0,eth:0,gluc:0,disks:0,stopper:false},{id:3,water:0,eth:0,gluc:0,disks:0,stopper:false},{id:4,water:0,eth:0,gluc:0,disks:0,stopper:false}]); 
    setPrepTable([{id:1,water:'-',eth:'-',disks:'-',gluc:'-',time:'-'},{id:2,water:'-',eth:'-',disks:'-',gluc:'-',time:'-'},{id:3,water:'-',eth:'-',disks:'-',gluc:'-',time:'-'},{id:4,water:'-',eth:'-',disks:'-',gluc:'-',time:'-'}]); 
    setTitrStage(0); setTitrPink({ a: false, b: false, c: false, d: false }); setActiveTitrDrops({ a: [], b: [], c: [], d: [] }); setAgarHoles([]); setTowelDisks([]);
    setTitrTable([{id:'A1',transfer:'-',ind:'-',base:'-'},{id:'B1',transfer:'-',ind:'-',base:'-'},{id:'C1',transfer:'-',ind:'-',base:'-'},{id:'D1',transfer:'-',ind:'-',base:'-'}]); 
  };


  return (
    <div className="mb-14 text-right">
      <div className="flex items-center gap-3 mb-6 border-b-2 border-emerald-200 pb-3">
        <h2 className="text-xl md:text-2xl font-bold text-emerald-900">חלק ב' - ניסוי: השפעת אתנול וגלוקוז על קצב תהליך הנשימה התאית בשמרים</h2>
      </div>


      <div className="bg-amber-50/80 p-4 md:p-6 rounded-2xl mb-6 border border-amber-200 shadow-sm leading-relaxed text-stone-800 text-right">
        <h3 className="font-bold text-amber-900 mb-1 text-sm md:text-base">לידיעתכם:</h3>
        <p className="text-sm md:text-[15px]">אתנול הוא חומר הממס שומנים ופוגע במבנה המרחבי של חלבונים. פחמן דו-חמצני (CO2) הנוצר בנשימה תאית מגיב עם מים ויוצר חומצה.</p>
      </div>


      <div className="bg-emerald-50/70 p-4 md:p-6 rounded-2xl mb-8 border border-emerald-100 shadow-sm text-stone-800 leading-relaxed text-right">
        <h3 className="font-bold text-emerald-900 mb-2 text-base md:text-lg">📋 שלב ב1: הכנת דסקיות שמרים מקובעים באגר, הכנת התמיסות והדגרה</h3>
        <p className="text-sm md:text-[16px] mb-2">
          נבדוק את השפעת האתנול והגלוקוז על קצב הנשימה של השמרים. בנשימה תאית נפלט פחמן דו-חמצני (CO2), שמתמוסס במים ויוצר חומצה.
        </p>
        <p className="text-emerald-800 font-bold text-right text-sm md:text-base mt-2">הפעילו את שלבי האנימציה ועקבו אחר תהליך ההכנה בטבלה:</p>
      </div>


      <div className="bg-white border-2 border-stone-100 p-3 md:p-5 rounded-2xl mb-8 shadow-sm relative overflow-hidden text-right">
        <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-2 mb-2 relative z-20 bg-stone-50 p-2 md:p-3 rounded-xl border border-stone-200">
          <button onClick={runPrepStep1} disabled={prepStage!==0||isSeqAnimating} className="w-full md:w-auto px-1 py-2 md:px-4 md:py-2.5 bg-amber-500 text-white font-bold rounded-lg shadow-sm text-[13px] sm:text-sm md:text-base flex items-center justify-center text-center leading-tight">1. הכנת דסקיות</button>
          <button onClick={runPrepStep2} disabled={prepStage!==1||isSeqAnimating} className="w-full md:w-auto px-1 py-2 md:px-4 md:py-2.5 bg-sky-500 text-white font-bold rounded-lg shadow-sm text-[13px] sm:text-sm md:text-base flex items-center justify-center text-center leading-tight">2. מים ואתנול</button>
          <button onClick={runPrepStep3} disabled={prepStage!==2||isSeqAnimating} className="w-full md:w-auto px-1 py-2 md:px-4 md:py-2.5 bg-orange-500 text-white font-bold rounded-lg shadow-sm text-[13px] sm:text-sm md:text-base flex items-center justify-center text-center leading-tight">3. שמרים ואמבט</button>
          <button onClick={runPrepStep4} disabled={prepStage!==3||isSeqAnimating} className="w-full md:w-auto px-1 py-2 md:px-4 md:py-2.5 bg-emerald-500 text-white font-bold rounded-lg shadow-sm text-[13px] sm:text-sm md:text-base flex items-center justify-center text-center leading-tight">4. גלוקוז ומיהול</button>
          <button onClick={resetPartB} className="col-span-2 md:col-span-1 w-full md:w-auto px-1 py-2 md:px-4 md:py-2.5 bg-stone-200 font-bold rounded-lg shadow-sm text-[13px] sm:text-sm md:text-base flex items-center justify-center text-center leading-tight gap-1.5"><span>↺</span> איפוס</button>
        </div>
        
        <div className="relative w-full max-w-4xl mx-auto h-[320px] sm:h-[340px] md:h-[380px] bg-white rounded-xl border border-stone-200 overflow-hidden flex justify-center items-end pb-4 pt-16 md:pt-20 shadow-inner">
          <div className="absolute top-0 left-0 w-full bg-emerald-100/90 border-b border-emerald-200 p-2 md:p-3 z-40 text-center shadow-sm min-h-[44px] flex items-center justify-center transition-all duration-300">
            <p className="text-xs md:text-sm text-emerald-900 px-2 leading-snug">
              {prepStage === 0 && "לחצו על השלבים למעלה כדי להתחיל בהכנת הניסוי והאנימציה."}
              {prepStage === 1 && <span><strong>הכנת דסקיות:</strong> נחתוך דסקיות אגר ובהן שמרים מקובעים בעזרת קשית קצרה.</span>}
              {prepStage === 2 && <span><strong>מים ואתנול:</strong> נוסיף מים מזוקקים ואתנול למבחנות.</span>}
              {prepStage === 3 && <span><strong>הוספת שמרים:</strong> נוסיף 8 דסקיות לכל מבחנה ונכניס לאמבט מים.</span>}
              {prepStage === 4 && <span><strong>גלוקוז ומיהול סדרתי:</strong> נוסיף תמיסת גלוקוז, נבצע מיהול בין המבחנות ונדגיר באמבט מים (38-42°C).</span>}
            </p>
          </div>
          
          <div className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-1000 ${tubesY > 0 ? 'h-32 md:h-40 water-bath' : 'h-0 opacity-0'}`}></div>
          {tubesY > 0 && <div className="absolute top-[60px] right-4 md:top-[60px] md:right-6 bg-white p-2 md:p-3 rounded-xl shadow-lg z-30 border border-stone-200 flex flex-col items-center"><span className="text-[10px] md:text-xs font-bold text-stone-600">טמפרטורת אמבט</span><span className="text-lg md:text-xl font-mono font-extrabold text-rose-500">40°C</span></div>}
          {prepTimer>0 && <div className="absolute top-[60px] left-4 md:top-[60px] md:left-6 bg-white p-2 md:p-3 rounded-xl shadow-lg z-30 border border-stone-200 flex flex-col items-center"><span className="text-[10px] md:text-xs font-bold text-stone-600">זמן הדגרה</span><span className="text-xl md:text-2xl font-mono font-extrabold text-orange-500">{prepTimer}:00</span></div>}
          
          {prepStage===1 && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10 overflow-hidden pt-[50px]">
              <div className="relative w-[400px] h-[280px] shrink-0 scale-[0.7] sm:scale-[0.85] md:scale-100 origin-bottom">
                <div className="absolute bottom-4 left-[20px] flex flex-col items-center">
                  <div className="w-40 h-20 bg-stone-200 rounded-[50%] border-[5px] border-stone-300 relative shadow-md flex items-center justify-center">
                    <div className="w-32 h-14 bg-white/90 rounded-[50%] border border-stone-200 shadow-inner"></div>
                    <div className="absolute flex flex-wrap gap-2 w-16 top-6 right-12">
                      {towelDisks.map(i => <div key={i} className="w-3.5 h-3.5 bg-amber-700 rounded-full shadow-sm"></div>)}
                    </div>
                  </div>
                  <span className="mt-4 font-bold text-base">מגבת נייר לחה</span>
                </div>
                <div className="absolute bottom-4 right-[20px] flex flex-col items-center">
                  <div className="w-40 h-20 bg-[#e6ceb3] rounded-[50%] border-[5px] border-[#c4a482] relative shadow-lg flex items-center justify-center overflow-hidden">
                    <div className="absolute bottom-0 w-full h-8 bg-[#c4a482] rounded-b-[50%] opacity-50"></div>
                    {agarHoles.map((pos, idx) => (
                      <div key={idx} className="absolute w-4 h-4 rounded-full bg-[#9e7e5d] shadow-inner border border-[#8a6847]" style={{ top: `${pos.top}px`, left: `${pos.left}px` }}></div>
                    ))}
                  </div>
                  <span className="mt-4 font-bold text-base">מצע אגר (שמרים)</span>
                </div>
                {strawPos.visible && <div className="straw" style={{ right: `${strawPos.right}px`, bottom: `${strawPos.bottom}px` }}></div>}
              </div>
            </div>
          )}


          <div className="w-full flex justify-center scale-75 sm:scale-90 md:scale-100 origin-bottom">
            <div className="flex gap-4 md:gap-8 relative z-10 transition-transform duration-1000" style={{ transform: `translateY(${tubesY}px)`, opacity: prepStage>=2?1:0 }}>
              {tubesData.map((t, i) => (
                <div key={i} className="flex flex-col items-center relative w-14">
                  {pipetteState.tubeId===(i+1) && <div className="absolute bottom-full mb-4 w-full flex flex-col items-center transition-all duration-400 z-40" style={{ transform: `translateY(${pipetteState.y}px)` }}><div className="pipette-tip relative"><div className={`pipette-liquid ${pipetteState.type === 'water' ? 'bg-sky-300' : pipetteState.type === 'ethanol' ? 'bg-purple-300' : pipetteState.type === 'glucose' ? 'bg-green-400' : 'bg-transparent'}`} style={{ height: pipetteState.liquidHeight }}></div></div>{pipetteState.dropping && [1,2,3].map(d => <div key={d} className={`falling-drop drop-${pipetteState.type}`} style={{ animationDelay: `${d*0.1}s` }}></div>)}</div>}
                  {spoonState.tubeId===(i+1) && <div className="absolute bottom-full mb-8 z-50 left-1/2 translate-x-[35px]"><svg viewBox="0 0 100 40" className="spoon relative z-40" style={{ transform: spoonState.rotated ? 'rotate(-45deg)' : 'rotate(0deg)' }}><rect x="30" y="15" width="70" height="8" rx="4" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5"/><ellipse cx="20" cy="19" rx="20" ry="12" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5"/>{!spoonState.dropping && <g fill="#b45309"><circle cx="16" cy="16" r="3"/><circle cx="22" cy="14" r="3"/><circle cx="19" cy="11" r="3"/><circle cx="25" cy="17" r="3"/></g>}</svg>{spoonState.dropping && <div className="absolute top-2 left-[-35px] z-50 flex flex-col items-center gap-0.5 animate-[disk-drop_1s_ease-in_forwards]"><div className="w-2.5 h-2.5 bg-amber-700 rounded-full shadow-sm translate-x-1"></div><div className="w-2.5 h-2.5 bg-amber-700 rounded-full shadow-sm -translate-x-1"></div><div className="w-2.5 h-2.5 bg-amber-700 rounded-full shadow-sm translate-x-2"></div><div className="w-2.5 h-2.5 bg-amber-700 rounded-full shadow-sm"></div></div>}</div>}
                  <div className="w-14 h-48 border-x-[5px] border-b-[5px] border-stone-300 relative bg-white/95 overflow-hidden shadow-inner mt-2" style={{ borderBottomLeftRadius: '2rem', borderBottomRightRadius: '2rem' }}>
                    <div className="absolute bottom-0 w-full flex flex-col justify-end h-full">
                      <div className="tube-liquid bg-sky-200" style={{ height: `${t.water}%` }}></div>
                      <div className="tube-liquid bg-purple-200" style={{ height: `${t.eth}%` }}></div>
                      <div className="tube-liquid bg-green-200" style={{ height: `${t.gluc}%` }}></div>
                    </div>
                    {t.disks > 0 && <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-1 w-12 z-10">{[...Array(t.disks)].map((_, j) => <div key={j} className="w-2.5 h-2.5 rounded-full bg-amber-600"></div>)}</div>}
                    {t.stopper && <div className="absolute top-0 left-0 right-0 h-5 bg-amber-800 border-b-2 border-amber-900 shadow-md"></div>}
                  </div><span className="mt-4 font-extrabold text-stone-800 bg-white/90 px-4 py-1 rounded-lg border border-stone-200 shadow-sm text-[10px] sm:text-xs md:text-[15px] whitespace-nowrap text-right">מבחנה {t.id}</span>
                </div>
              ))}
              {showWaste && (
                <div className="flex flex-col items-center relative w-16 md:w-20 transition-opacity duration-500 text-right">
                  {pipetteState.tubeId === 'waste' && (
                    <div className="absolute bottom-full mb-4 w-full flex flex-col items-center transition-all duration-400 z-40" style={{ transform: `translateY(${pipetteState.y}px)` }}>
                      <div className="pipette-tip relative">
                        <div className="pipette-liquid bg-green-400" style={{ height: pipetteState.liquidHeight }}></div>
                      </div>
                      {pipetteState.dropping && [1,2,3].map(d => <div key={d} className="falling-drop drop-glucose" style={{ animationDelay: `${d*0.1}s` }}></div>)}
                    </div>
                  )}
                  <div className="w-14 md:w-16 h-32 border-x-[4px] border-b-[4px] border-stone-400 relative bg-stone-100/80 overflow-hidden shadow-inner mt-20" style={{ borderBottomLeftRadius: '1.5rem', borderBottomRightRadius: '1.5rem' }}>
                    <div className="absolute bottom-0 w-full bg-green-200/80 transition-all duration-1000 border-t border-green-300" style={{ height: wasteHeight }}></div>
                  </div>
                  <span className="mt-4 font-bold text-stone-600 bg-stone-200 px-3 py-1 rounded-lg border border-stone-300 text-[10px] sm:text-xs md:text-[15px] whitespace-nowrap">כלי פסולת</span>
                </div>
              )}
            </div>
          </div>
        </div>


        <div className="w-full text-right mt-2 md:mt-3">
          <table className="w-full text-center border-collapse bg-white border border-stone-300 text-[10px] sm:text-xs md:text-[15px] shadow-sm table-fixed">
            <thead className="bg-stone-100 border-b-2 border-stone-300">
              <tr>
                <th className="p-1 md:p-2 border-x w-[10%] break-words">מבחנה</th>
                <th className="p-1 md:p-2 border-x w-[18%] break-words">מים מזוקקים (מ"ל)</th>
                <th className="p-1 md:p-2 border-x w-[18%] break-words">אתנול 70% (מ"ל)</th>
                <th className="p-1 md:p-2 border-x w-[18%] break-words">דסקיות שמרים</th>
                <th className="p-1 md:p-2 border-x w-[22%] text-stone-700 break-words">תמיסת גלוקוז 0.5M</th>
                <th className="p-1 md:p-2 border-x w-[14%] break-words">זמן באמבט</th>
              </tr>
            </thead>
            <tbody>
              {prepTable.map((row) => (
                <tr key={row.id} className="border-b">
                  <td className="p-1 md:p-2 border-x font-bold text-stone-800 text-center">{row.id}</td>
                  <td className="p-1 md:p-2 border-x text-stone-600 text-center">{row.water}</td>
                  <td className="p-1 md:p-2 border-x text-stone-600 text-center">{row.eth}</td>
                  <td className="p-1 md:p-2 border-x text-stone-600 text-center">{row.disks}</td>
                  <td className="p-1 md:p-2 border-x leading-tight md:leading-relaxed font-bold text-stone-700 text-center text-[9px] sm:text-[10px] md:text-[15px]">{row.gluc}</td>
                  <td className="p-1 md:p-2 border-x font-bold text-stone-800 text-center">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      <div className="bg-emerald-50/70 p-4 md:p-6 rounded-2xl mb-8 border border-emerald-100 shadow-sm mt-8 text-stone-800 leading-relaxed text-right">
        <h3 className="font-bold text-emerald-900 mb-3 text-base md:text-lg">📋 שלב ב2: בדיקת הכמות היחסית של חומצה בכל אחת מן המבחנות D-A</h3>
        <p className="text-sm md:text-[16px] mb-2">
          בתגובה בין פחמן דו חמצני (CO2) ובין מים נוצרת חומצה (חומצה פחמתית). נמדוד כמה חומצה נוצרה בכל אחת מהן.
        </p>
        <p className="text-emerald-800 font-bold text-sm md:text-base mt-2">הפעילו את שלבי הטיטרציה באנימציה ועקבו אחר ההנחיות המופיעות בה:</p>
      </div>


      <div className="bg-white border-2 border-stone-100 p-3 md:p-5 rounded-2xl mb-12 shadow-sm relative overflow-hidden text-right">
        <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-2 mb-2 bg-stone-50 p-2 md:p-3 rounded-xl border border-stone-200">
          <button onClick={handleTitrStep1} disabled={titrStage!==0||isAnyAnimating} className="w-full md:w-auto px-1 py-2 md:px-5 md:py-2.5 bg-stone-500 text-white font-bold rounded-lg shadow-sm text-[13px] sm:text-sm md:text-base flex items-center justify-center text-center leading-tight">1. סימון 3 ס"מ</button>
          <button onClick={handleTitrStep2} disabled={titrStage!==1||isAnyAnimating} className="w-full md:w-auto px-1 py-2 md:px-5 md:py-2.5 bg-blue-500 text-white font-bold rounded-lg shadow-sm text-[13px] sm:text-sm md:text-base flex items-center justify-center text-center leading-tight">2. העברת נוזלים</button>
          <button onClick={handleTitrStep3} disabled={titrStage!==2||isSeqAnimating} className="w-full md:w-auto px-1 py-2 md:px-5 md:py-2.5 bg-purple-500 text-white font-bold rounded-lg shadow-sm text-[13px] sm:text-sm md:text-base flex items-center justify-center text-center leading-tight">3. פנול-פתלאין</button>
          <button onClick={handleTitrStep4} disabled={titrStage!==3||isSeqAnimating} className="w-full md:w-auto px-1 py-2 md:px-5 md:py-2.5 bg-pink-500 text-white font-bold rounded-lg shadow-sm text-[13px] sm:text-sm md:text-base flex items-center justify-center text-center leading-tight">4. טפטוף בסיס</button>
          <button onClick={resetPartB} className="col-span-2 md:col-span-1 w-full md:w-auto px-1 py-2 md:px-5 md:py-2.5 bg-stone-200 font-bold rounded-lg shadow-sm shadow-inner text-[13px] sm:text-sm md:text-base flex items-center justify-center text-center leading-tight gap-1.5"><span>↺</span> איפוס</button>
        </div>
        
        <div className="relative w-full max-w-4xl mx-auto border border-stone-100 rounded-xl bg-slate-50 shadow-inner overflow-hidden flex justify-center items-end h-[240px] sm:h-[260px] md:h-[300px] pb-2 pt-14 md:pt-16">
          <div className="absolute top-0 left-0 w-full bg-emerald-100/90 border-b border-emerald-200 p-2 z-40 text-center shadow-sm min-h-[44px] flex items-center justify-center transition-all duration-300">
            <p className="text-xs md:text-sm text-emerald-900 px-2 leading-snug">
              {titrStage === 0 && "לחצו על השלבים למעלה כדי להתחיל בבדיקת החומציות (טיטרציה)."}
              {titrStage === 1 && <span><strong>סימון גובה:</strong> נסמן על 4 מבחנות חדשות (A1-D1) קו בגובה 3 ס"מ.</span>}
              {titrStage === 2 && <span><strong>העברת נוזל:</strong> נעביר מכל מבחנה (1-4) את נוזל ההדגרה למבחנה החדשה עד לקו ה-3 ס"מ.</span>}
              {titrStage === 3 && <span><strong>הוספת אינדיקטור:</strong> נוסיף 2 טיפות פנול-פתלאין לכל מבחנה.</span>}
              {titrStage === 4 && <span><strong>טיטרציה:</strong> נטפטף בסיס (NaOH) ונספור טיפות עד לקבלת צבע ורוד יציב.</span>}
            </p>
          </div>
          <div className="flex justify-center items-end gap-8 md:gap-16 scale-75 sm:scale-90 md:scale-100 origin-bottom w-full">
            {['a', 'b', 'c', 'd'].map((id) => (
              <div key={id} className="flex flex-col items-center relative w-16 text-right">
                <div className={`absolute bottom-full mb-2 w-full flex flex-col items-center justify-end z-40 min-h-[55px] transition-opacity duration-300 ${(titrPipette.visible&&titrPipette.tubeId===id)||titrStage===4 ? 'opacity-100' : 'opacity-0'}`}>
                  {titrPipette.visible && titrPipette.tubeId === id && (<><div className="pipette-tip relative"><div className={`pipette-liquid ${titrPipette.type==='indicator'?'bg-slate-200':'bg-blue-300'}`} style={{ height: '50%' }}></div></div>{titrPipette.dropping && [1,2,3].map(d => <div key={d} className={`falling-drop ${titrPipette.type==='indicator'?'drop-indicator':'drop-mixed'}`} style={{ animationDelay: `${d*0.15}s` }}></div>)}</>)}
                  {titrStage === 4 && (<><div className="pipette-tip relative"><div className="pipette-liquid bg-sky-400" style={{ height: '70%' }}></div></div>{activeTitrDrops[id].map(dropId => <div key={`${id}-${dropId}`} className="falling-drop drop-base"></div>)}</>)}
                </div>
                <div className="w-14 md:w-16 h-36 border-x-[5px] border-b-[5px] border-stone-300 relative bg-stone-50 mt-4 overflow-hidden" style={{ borderBottomLeftRadius: '2rem', borderBottomRightRadius: '2rem' }}>
                  {titrStage >= 1 && <div className="absolute bottom-[35%] w-full border-b-[2px] border-rose-500 border-dashed z-20"></div>}
                  {titrStage >= 2 && <div className="tube-liquid absolute bottom-0" style={{ height: titrLiquidHeight[id], backgroundColor: titrPink[id] ? '#f9a8d4' : 'rgba(226, 232, 240, 0.6)' }}></div>}
                </div><span className="mt-4 font-bold text-[10px] sm:text-xs md:text-[15px] whitespace-nowrap text-stone-800">מבחנה {id.toUpperCase()}1</span>
              </div>
            ))}
          </div>
        </div>


        <div className="w-full mt-2 md:mt-3 text-right">
          <table className="w-full text-center border-collapse bg-white shadow-sm border border-stone-300 text-[10px] sm:text-xs md:text-[15px] text-stone-700 font-bold table-fixed">
            <thead className="bg-stone-100 border-b-2 border-stone-300">
              <tr>
                <th className="p-1 md:p-2 border-x w-[15%] break-words">מבחנה</th>
                <th className="p-1 md:p-2 border-x w-[35%] break-words">הכנסת נוזל עד קו של 3 ס"מ</th>
                <th className="p-1 md:p-2 border-x w-[25%] break-words">מספר טיפות פנול-פתלאין</th>
                <th className="p-1 md:p-2 border-x w-[25%] break-words">מספר טיפות בסיס עד לשינוי צבע</th>
              </tr>
            </thead>
            <tbody>
              {titrTable.map((row) => (
                <tr key={row.id} className="border-b text-stone-800 text-center">
                  <td className="p-1 md:p-2 border-x font-bold text-stone-800">{row.id}</td>
                  <td className="p-1 md:p-2 border-x text-stone-600">{row.transfer}</td>
                  <td className="p-1 md:p-2 border-x text-stone-600">{row.ind}</td>
                  <td className="p-1 md:p-2 border-x font-mono font-bold text-sm md:text-lg text-sky-800 text-center">{row.base}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* Part B Questions Section */}
      <MultipleChoiceQnA 
        qNum="3" 
        question="חשבו את ריכוזי הגלוקוז במבחנות 1-3 על פי הנתונים הבאים: מבחנה 1 קיבלה 5 מ''ל גלוקוז בריכוז 0.5M ו-5 מ''ל מים. מבחנה 2 קיבלה 1 מ''ל מהתמיסה של מבחנה 1 ו-9 מ''ל מים. מבחנה 3 קיבלה 1 מ''ל ממבחנה 2 ו-9 מ''ל מים." 
        options={["במבחנה 1 הריכוז הוא 0.25M, במבחנה 2 הריכוז הוא 0.025M ובמבחנה 3 הריכוז הוא 0.0025M.", "במבחנה 1 הריכוז הוא 0.10M, במבחנה 2 הריכוז הוא 0.010M ובמבחנה 3 הריכוז הוא 0.0010M.", "במבחנה 1 הריכוז הוא 0.50M, במבחנה 2 הריכוז הוא 0.250M ובמבחנה 3 הריכוז הוא 0.1250M.", "במבחנה 1 הריכוז הוא 0.25M, במבחנה 2 הריכוז הוא 0.125M ובמבחנה 3 הריכוז הוא 0.0625M."]} 
        correctAnswerIndex={0} 
        explanation="במבחנה 1: הוסיפו 5 מ''ל תמיסת גלוקוז (0.5M) ל-5 מ''ל מים, התמיסה נמהלה פי 2 ולכן הריכוז ירד פי 2 (0.25M). במבחנה 2: הוסיפו 1 מ''ל מהתמיסה ל-9 מ''ל מים, התמיסה נמהלה פי 10 ולכן הריכוז ירד פי 10 (0.025M). במבחנה 3 נמהלה התמיסה פי 10 נוספים (0.0025M)." 
      />


      <ClassificationTable 
        qNum="4"
        question="לפניכם ארבעה מִבֵּין רכיבי הניסוי שערכתם בחלק ב. סווגו כל רכיב לתפקידו המתאים:"
        rows={["מספר טיפות הבסיס NaOH שנדרשו לשינוי צבע התמיסה","קצב הנשימה התאית בשמרים מקובעים באגר","טמפרטורת המים באמבט","מספר הטיפות של פנול-פתלאין"]}
        options={["גורם קבוע", "משתנה תלוי", "דרך המדידה"]}
        correctAnswers={[2, 1, 0, 0]}
        explanation="קצב הנשימה התאית הוא משתנה תלוי. מספר טיפות הבסיס (NaOH) שנדרשו לשינוי צבע התמיסה הוא דרך המדידה של המשתנה התלוי. טמפרטורת המים באמבט ומספר הטיפות של פנול-פתלאין הם גורמים קבועים."
      />


      <MultipleChoiceQnA qNum="5" question="הימצאות אתנול במבחנות היא משתנה בלתי תלוי אחד בניסוי שערכתם. מהו המשתנה הבלתי תלוי האחר בניסוי שערכתם?" options={["ריכוז הגלוקוז בתמיסה שבתוך כל מבחנה.","קצב פליטת הפחמן הדו-חמצני במהלך הנשימה.","מספר דסקיות השמרים המקובעות בתוך האגר.","טמפרטורת אמבט המים במהלך שלב ההדגרה."]} correctAnswerIndex={0} explanation="המשתנה הבלתי תלוי האחר בניסוי הוא ריכוז הגלוקוז בתמיסות שבהן שרו השמרים." />
      <MultipleChoiceQnA qNum="6" question="מדוע חשוב שדווקא מספר דסקיות שמרים (8 דסקיות) יהיה גורם קבוע בניסוי שערכתם?" options={["כיוון שכמות השמרים משפיעה על קצב הנשימה ופליטת ה-CO2.","כדי להבטיח שלכל השמרים תהיה גישה שווה לחמצן באוויר.","כדי שהמיהולים של הגלוקוז יישארו מדויקים לאורך זמן הניסוי.","כדי שדסקיות האגר לא יתפרקו עקב כמות גדולה של תוצרי לוואי."]} correctAnswerIndex={0} explanation="כמות השמרים (התאים / האנזימים) משפיעה על קצב תהליך הנשימה התאית. בניסוי נבדקה ההשפעה של משתנה בלתי תלוי אחר (ריכוז גלוקוז והימצאות אתנול), ולכן כל שאר הגורמים צריכים להישמר קבועים." />
      <MultipleChoiceQnA qNum="7" question="הציעו הסבר לתוצאות הניסוי שהתקבלו במבחנות C-A (הקשר בין גלוקוז לטיטרציה):" options={["ככל שריכוז הגלוקוז גבוה, נוצר יותר CO2 שיוצר חומצה המצריכה בסיס.","ריכוז גלוקוז נמוך מזרז את נשימת השמרים ולכן מצריך יותר בסיס.","הגלוקוז הוא בסיסי וסותר את החומצה הפחמתית הנוצרת במים.","אין קשר ישיר בין ריכוז הגלוקוז במבחנות לבין כמות החומצה שנמדדה."]} correctAnswerIndex={0} explanation="הגלוקוז הוא מגיב / מצע / סובסטרט בתהליך הנשימה התאית. ככל שריכוז הגלוקוז גבוה יותר, קצב תהליך הנשימה גבוה יותר. כתוצאה מכך נוצר יותר CO2 ונוצרת יותר חומצה פחמתית, ולכן נדרש מספר גדול יותר של טיפות בסיס לנטרול החומצה (עד לקבלת צבע ורוד)." />
      <MultipleChoiceQnA qNum="8" question="הציעו הסבר להבדל בין התוצאה שקיבלתם במבחנה D לתוצאה במבחנה A:" options={["אתנול הוא חומר הממס שומנים ופוגע בחלבונים, מה שמעכב את הנשימה.","האתנול מזרז את נשימת השמרים וגורם ליצירה מוגברת מאוד של פד''ח.","האתנול מגיב עם פנול-פתלאין ומשנה את צבעו מראש ללא קשר ל-pH.","ריכוז הגלוקוז במבחנה D1 היה נמוך משמעותית מריכוז הגלוקוז במבחנה A1."]} correctAnswerIndex={0} explanation="במבחנה D קיים אתנול בניגוד למבחנה A. האתנול פוגע בקרומי תאי השמרים, בחלבונים ובאנזימי הנשימה, ולכן קצב תהליך הנשימה התאית איטי יותר. כתוצאה מכך נוצר פחות CO2 ופחות חומצה, ולכן נדרש מספר קטן יותר של טיפות בסיס לנטרול החומצה." />
      <MultipleChoiceQnA qNum="9" question="מהי החשיבות של הוספת מבחנת בקרה המכילה מים ודסקיות שמרים בלבד (ללא גלוקוז)?" options={["כדי לוודא שהשינוי בחומציות נובע רק מפירוק הגלוקוז בתהליך הנשימה.","לבדיקת עמידות הדסקיות לאורך זמן בטמפרטורה הגבוהה של האמבט.","כדי להשוות את קצב ייצור האתנול הפנימי של השמרים ללא סוכר חיצוני.","כדי להוכיח שהאגר אינו מתפרק במים ומפריש חומרים בסיסיים למבחנה."]} correctAnswerIndex={0} explanation="הבקרה נועדה לשלול הסבר חלופי שעל פיו שינוי ה-pH מתרחש עקב תהליך אחר שאינו קשור להשפעת גלוקוז על קצב הנשימה התאית, וכן כדי לוודא שללא גלוקוז אין בשמרים תהליך שגורם לשינוי חומציות/בסיסיות התמיסה." />
      <MultipleChoiceQnA qNum="10" question="תלמידים טענו שהשפעת האתנול על קצב נשימה תאית תהיה דומה בכל היצורים החיים. האם טענתם נכונה?" options={["כן, כי מבנה קרום התא והאנזימים דומה בבסיסו בכל היצורים החיים.","לא, כי רק יצורים חד-תאיים כמו שמרים נפגעים מממיסים אורגניים.","כן, כי אתנול הוא מקור אנרגיה חיובי עבור כל סוגי התאים בטבע.","לא, כי חדירות האתנול לתאים של יונקים נמוכה בהרבה מלתאי שמרים."]} correctAnswerIndex={0} explanation="כן. לכל התאים יש חלבונים וקרומים. האתנול פוגע בחלבונים ובקרומי תאים, ולכן השפעת האתנול צפויה להיות דומה בכל היצורים." />
    </div>
  );
};


const PartC = () => {
  return (
    <div className="mb-12 text-right">
      <div className="flex items-center gap-3 mb-6 border-b-2 border-emerald-200 pb-3 text-right">
        <h2 className="text-xl md:text-2xl font-bold text-emerald-900 text-right text-stone-900">חלק ג' - ניתוח תוצאות מחקר: השפעת ריכוז אתנול על התרבות שמרים</h2>
      </div>


      <div className="bg-emerald-50/70 p-4 md:p-6 rounded-2xl mb-8 border border-emerald-100 shadow-sm text-stone-800 leading-relaxed text-right">
        <p className="mb-4 text-sm md:text-[15px]">אתנול הוא אחד התוצרים של תהליך התסיסה שמתרחש בשמרים. לאתנול יש ערך רב בתעשיית היין, הוא משמש דלק ביולוגי, חומר חיטוי ועוד.</p>
        <p className="mb-4 text-sm md:text-[15px]">אתנול בריכוזים מסוימים שנמצא בסביבת השמרים, מגביל את קצב התהליכים שמתרחשים בתאי השמרים, ובעקבות זאת גם קצב ההתרבות של השמרים איטי יותר.</p>
        <p className="mb-4 text-sm md:text-[15px]">חוקרים רבים מנסים למצוא זן של שמרים המסוגלים לחיות בסביבה שבה ריכוז האתנול גבוה, ולהתרבות בקצב מהיר.</p>
        <h3 className="font-bold text-emerald-900 mb-2 text-right text-sm md:text-base">ניסוי 1</h3>
        <p className="mb-4 text-sm md:text-[15px]">חוקרים הוסיפו אתנול בריכוזים שונים לתמיסת גידול ובה שמרים. הם בדקו את קצב ההתרבות של שני זני שמרים במשך 48 שעות. בטבלה 3 שלפניכם נתונים על קצב ההתרבות של השמרים בתמיסות שבהן אתנול בריכוזים שונים.</p>
      </div>


      <div className="bg-white p-4 md:p-8 border-2 border-stone-100 rounded-2xl shadow-sm mb-10 flex flex-col items-center text-right">
        <h4 className="font-bold text-center mb-6 text-emerald-900 text-sm md:text-base bg-emerald-50 w-full py-3 rounded-lg px-2 md:pr-4 text-right">טבלה 3: קצב התרבות השמרים כתלות בריכוז אתנול</h4>
        <div className="w-full overflow-x-auto pb-2 mx-auto mb-6">
          <table className="w-full text-center border-collapse bg-white shadow-sm border border-stone-300 text-xs md:text-[15px] min-w-max">
            <thead className="bg-stone-100 border-b-2 border-stone-300 text-stone-700 font-bold">
              <tr><th className="p-2 md:p-3 border-x" rowSpan="2">ריכוז אתנול (%)</th><th className="p-2 md:p-3 border-x" colSpan="2">קצב התרבות (יחידות יחסיות)</th></tr>
              <tr><th className="p-2 md:p-3 border-x">זן א'</th><th className="p-2 md:p-3 border-x">זן ב'</th></tr>
            </thead>
            <tbody>
              {[[0,1.9,2.0],[4,1.9,2.1],[8,1.3,1.8],[10,0.7,1.6],[12,0.2,1.3],[16,0,0.5]].map((r,i)=>(
                <tr key={i} className="border-b text-center"><td className="p-2 md:p-3 border-x font-bold text-stone-800">{r[0]}%</td><td className="p-2 md:p-3 border-x text-stone-600">{r[1]}</td><td className="p-2 md:p-3 border-x text-stone-600">{r[2]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      <MultipleChoiceQnA qNum="11" question="איזה סוג של הצגה גרפית הוא המתאים ביותר לתיאור התוצאות המוצגות בטבלה 3?" options={["גרף רציף (קו), כיוון שריכוז האתנול הוא משתנה כמותי רציף.","דיאגרמת עמודות, כיוון שההשוואה בין הזנים השונים היא המטרה העיקרית.","דיאגרמת עוגה, המראה את החלק היחסי של כל זן בכל מדידה.","גרף נקודות מפוזר, כיוון שאין קשר ישיר בין המדידות בטבלה."]} correctAnswerIndex={0} explanation="ההצגה הגרפית המתאימה היא גרף רציף (עקום). הנימוק לכך הוא שהמשתנה הבלתי תלוי (ריכוז אתנול) הוא משתנה רציף / כמותי / מדיד, ויש משמעות לערכי הביניים." />
      <MultipleChoiceQnA qNum="12" question="תארו את התוצאות של ניסוי 1 כפי שהן משתקפות בנתוני טבלה 3." options={["ככל שריכוז האתנול עולה, חלה ירידה הדרגתית בקצב ההתרבות בשני הזנים.","קצב ההתרבות עולה עם עליית ריכוז האתנול עד לשיא מסוים ואז יורד.","ריכוז האתנול אינו משפיע על זן ב', אך גורם למותם של כל תאי זן א'.","זן א' מתרבה מהר יותר מזן ב' ככל שריכוז האתנול בתמיסה עולה."]} correctAnswerIndex={0} explanation="בטווח ריכוזי אתנול 0-4% אין כמעט שינוי בקצב ההתרבות של שני הזנים. ככל שריכוז האתנול גבוה יותר (מ-4% עד 16%), קצב ההתרבות של שני הזנים יורד. קצב ההתרבות של זן ב' יורד לאט יותר בהשוואה לזן א' ולכן הוא גבוה יותר." />
      <MultipleChoiceQnA qNum="13" question="קבעו איזה משני הזנים - זן א או זן ב - עמיד יותר להשפעות האתנול. נמקו." options={["זן ב', כיוון שקצב ההתרבות שלו נותר גבוה יותר בהשוואה לזן א' בכל ריכוז.","זן א', כי הוא רגיש יותר ומגיב מהר אח יותר לשינויי ריכוז בסביבה.","שניהם עמידים באותה מידה בטווח הריכוזים של 0-4% אתנול.","לא ניתן לקבוע זאת בוודאות על פי הנתונים המוגבלים המופיעים בטבלה."]} correctAnswerIndex={0} explanation="זן ב' עמיד יותר להשפעות האתנול. הנימוק מהגרף: ניתן לראות שככל שמעלים את ריכוז האתנול, קצב ההתרבות של זן ב' גבוה יותר בהשוואה לזן א'. כמו כן, בריכוז הגבוה ביותר (16%) זן ב' ממשיך להתרבות בעוד זן א' אינו מתרבה כלל." />


      <div className="bg-emerald-50/70 p-4 md:p-6 rounded-2xl mb-8 border border-emerald-100 shadow-sm mt-12 text-stone-800 leading-relaxed text-right">
        <h3 className="font-bold text-emerald-900 mb-2 text-right text-sm md:text-base">ניסוי 2</h3>
        <p className="mb-4 text-sm md:text-[15px]">בתאי השמרים קיים הסוכר טרהלוז המשמש חומר תשמורת. במחקרים נמצא כי הימצאות טרהלוז בתאי השמרים מגינה עליהם מפני הנזקים שהאתנול גורם לקרומי התא ולחלבונים. חוקרים מדדו את ריכוזי הטרהלוז בתאי השמרים. התוצאות מוצגות בגרף 2.</p>
        
        <div className="w-full max-w-3xl mx-auto bg-white border border-stone-200 rounded-xl shadow-inner pt-4 md:pt-6 mb-6">
          <h4 className="font-bold text-sm md:text-base mb-4 text-center px-4">גרף 2: השפעת ריכוזי האתנול על ריכוז טרהלוז בתאי השמרים</h4>
          <div className="w-full overflow-x-auto pb-4 px-2 md:px-6" dir="ltr">
            <div className="min-w-[500px] w-full flex justify-center">
              <svg viewBox="0 0 650 320" className="w-full h-auto ltr" style={{ fontFamily: "'Rubik', sans-serif" }}>
                <g stroke="#e5e7eb" strokeWidth="1">{[0,40,80,120,160,200,240].map(v => <line key={v} x1="80" y1={250-v} x2="480" y2={250-v} strokeDasharray="2,2"/>)}</g>
                <polyline points="80,50 80,250 480,250" fill="none" stroke="#374151" strokeWidth="2"/>
                <path d="M 80 230 L 213 180 L 346 120 L 480 80" fill="none" stroke="#2563eb" strokeWidth="3"/>
                <path d="M 80 220 L 213 150 L 346 80 L 480 30" fill="none" stroke="#ea580c" strokeWidth="3" strokeDasharray="6,4"/>
                <g fontSize="11" textAnchor="end">{[0,5,10,15,20,25,30].map((v,i) => <text key={i} x="70" y={250-v*6.6+4}>{v}</text>)}</g>
                <g fontSize="11" textAnchor="middle">{[0,5,10,15].map((v,i) => <text key={i} x={80+(v/15)*400} y="270">{v}</text>)}</g>
                <text x="280" y="300" fontSize="13" fontWeight="bold">ריכוז אתנול (%)</text>
                <text x="25" y="170" fontSize="13" fontWeight="bold" transform="rotate(-90 25,170)">ריכוז טרהלוז (יח' יחסיות)</text>
                <g transform="translate(500,50)">
                   <line x1="0" y1="0" x2="30" y2="0" stroke="#2563eb" strokeWidth="3"/><text x="35" y="5" fontSize="11">זן א'</text>
                   <line x1="0" y1="20" x2="30" y2="20" stroke="#ea580c" strokeWidth="3" strokeDasharray="5,2"/><text x="35" y="25" fontSize="11">זן ב'</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <MultipleChoiceQnA qNum="14" question="על פי גרף 2 והמידע על סוכר הטרהלוז, מהוא ההסבר לתוצאות של זן ב בטבלה 1?" options={["זן ב' שומר על ריכוז טרהלוז גבוה יותר בכל הריכוזים, המגן על תאיו.","זן ב' מייצר פחות טרהלוז כדי לחסוך באנרגיה הדרושה להתמודדות עם האתנול.","הטרהלוז בזן ב' הופך לחומר רעיל בסביבת אתנול, מה שמזרז את ההתרבות.","אין קשר סיבתי מוכח בין רמת הטרהלוז בתא לבין קצב ההתרבות שנמדד."]} correctAnswerIndex={0} explanation="על פי הגרף, בזן ב' יש יותר טרהלוז ככל שריכוזי האתנול גבוהים יותר. טרהלוז מגן מפני השפעת האתנול, ולכן קצב ההתרבות של זן ב' גבוה יותר בהשוואה לזן א'." />
      <div className="bg-emerald-50/70 p-4 md:p-6 rounded-2xl mb-8 border border-emerald-100 shadow-sm text-right mt-12 text-stone-800 leading-relaxed text-right">
        <p className="mb-4 text-sm md:text-[15px]">בתאי השמרים יש אנזים שמזרז בנייה של הסוכר טרהלוז מחד־סוכרים, ויש אנזים אחר שמזרז פירוק של טרהלוז לחד־סוכרים. נמצא כי בתמיסה שבה ריכוז אתנול הוא 10%, קצב הפעילות של האנזים המזרז פירוק טרהלוז בזן ב נמוך בהשוואה לזן א, וקצב ההתרבות של זן ב גבוה יותר.</p>
      </div>
      <MultipleChoiceQnA qNum="15" question="מדוע קצב הפעילות הנמוך של האנזים המפרק טרהלוז בזן ב' מאפשר לו קצב התרבות גבוה יותר?" options={["פעילות נמוכה של האנזים המפרק גורמת להצטברות טרהלוז בתא, המגן עליו.","פעילות נמוכה חוסכת לתא אנרגיה רבה המנוצלת כולה לטובת חלוקת תאים.","האנזים המפרק הוא רעלן בעצמו, ולכן רמה נמוכה שלו מאפשרת חיים תקינים.","קצב פירוק נמוך מעיד על כך שהתא נמצא בתרדמה זמנית המגנה על השמרים."]} correctAnswerIndex={0} explanation="כאשר פעילות האנזים המפרק טרהלוז נמוכה יותר, כמות הטרהלוז שנשארת בתאי השמרים גדולה יותר. הטרהלוז מגן על תאי השמרים מפני נזקי האתנול, ולכן זן ב' מוגן יותר / עמיד יותר, וקצב ההתרבות שלו גדול משל זן א'." />
      <MultipleChoiceQnA qNum="16" question="הסבירו כיצד הגנה על קרום התא בסביבה שיש בה אתנול מאפשרת לתאי השמרים לשמור על הומאוסטזיס." options={["הגנה על הקרום שומרת על בררנותו, מונעת חדירת רעלים ושומרת על סביבה יציבה.","על ידי הפיכת הקרום לאטום לחלוטין לכניסה של כל חומר חיצוני מהסביבה.","הקרום המוגן הופך למקור האנרגיה החלופי המועדף על השמרים בניסוי זה.","הגנה על הקרום מונעת פליטת פחמן דו-חמצני ובכך שומרת על רמת חומציות גבוהה."]} correctAnswerIndex={0} explanation="האתנול פוגע בקרום התא (בפוספוליפידים / בחלבונים). הגנה על קרום התא מאפשרת שמירה על בררנות הקרום ועל פעילות החלבונים. כך הסביבה הפנימית נשמרת שונה מהחיצונית ויש שמירה על מאזן מומסים (הומיאוסטזיס)." />
    </div>
  );
};


export default function App() {
  return (
    <div dir="rtl" className="rtl min-h-screen bg-stone-100 text-stone-900 font-sans p-2 sm:p-4 md:p-8">
      <style>{customStyles}</style>
      <div className="max-w-5xl mx-auto bg-white rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border border-emerald-100">
        <header className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 text-white p-6 md:p-10 text-center shadow-lg relative overflow-hidden text-right">
          <h1 className="text-base sm:text-xl md:text-3xl lg:text-4xl font-extrabold mb-3 md:mb-4 drop-shadow-md relative z-10 whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontFamily: "'Rubik', sans-serif" }}>מעבדה בביולוגיה: נשימה תאית בשמרים</h1>
          <div className="mt-2 md:mt-3 text-xs sm:text-sm md:text-[15px] bg-white/20 inline-block px-4 py-1.5 md:px-5 md:py-2 rounded-full font-bold backdrop-blur-md border border-white/40 shadow-sm relative z-10 tracking-wide text-right">בגרות בביולוגיה 2023- בעיה 5</div>
        </header>
        <main className="p-4 sm:p-6 md:p-12 text-right overflow-hidden">
          <PartA />
          <PartB />
          <PartC />
        </main>
        <footer className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 text-white p-4 md:p-6 text-center text-xs md:text-[15px] shadow-inner mt-4 md:mt-8">
          <p>כל הזכויות לתוכן הבחינה שמורות למשרד החינוך נערכת על ידי רבקה פרידלנד כהן</p>
        </footer>
      </div>
    </div>
  );
}



