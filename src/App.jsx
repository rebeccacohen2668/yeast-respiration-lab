import React, { useState, useEffect } from 'react';

// --- Custom CSS for Animations ---
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700;800&display=swap');
  
  @keyframes bubble-rise {
    0% { transform: translateY(0) scale(0.5); opacity: 0; }
    20% { opacity: 1; transform: translateY(-10px) scale(1); }
    100% { transform: translateY(-140px) scale(1.2); opacity: 0; }
  }
  
  @keyframes foam-grow-large {
    0% { height: 0; opacity: 0; }
    10% { opacity: 1; }
    100% { height: 45%; opacity: 1; }
  }
  
  @keyframes foam-grow-medium {
    0% { height: 0; opacity: 0; }
    10% { opacity: 1; }
    100% { height: 25%; opacity: 1; }
  }

  @keyframes pipette-drop {
    0% { transform: translateY(0) scale(0.5); opacity: 0; }
    20% { transform: translateY(3px) scale(1); opacity: 1; }
    80% { transform: translateY(40px) scale(0.8); opacity: 1; }
    100% { transform: translateY(50px) scale(0.5); opacity: 0; }
  }

  .animate-pipette-drop {
    animation: pipette-drop 0.6s ease-in infinite;
  }

  .bubble {
    position: absolute;
    bottom: 4px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.9);
    animation: bubble-rise infinite ease-in;
  }
  
  .foam-layer {
    position: absolute;
    width: 100%;
    background: rgba(255, 255, 255, 0.98);
    z-index: 20;
    border-top: 2px dotted rgba(180, 180, 180, 0.8);
    border-radius: 8px 8px 0 0;
  }
  
  .foam-large { animation: foam-grow-large 3s ease-out forwards; }
  .foam-medium { animation: foam-grow-medium 3s ease-out forwards; }

  .rtl { direction: rtl; }
  .ltr { direction: ltr; }
  
  body { font-family: 'Rubik', sans-serif; }
`;

// --- Multiple Choice Component ---
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
    <div className="border border-stone-200 rounded-xl p-4 md:p-5 mb-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="font-bold text-base md:text-lg mb-3 text-stone-800">
        שאלה {qNum}: <span className="font-normal whitespace-pre-line">{question}</span>
      </div>
      
      <div className="flex flex-col gap-2 mb-4">
        {options.map((option, index) => {
          let btnClass = "text-right p-3 rounded-lg border text-stone-700 transition-all duration-200 focus:outline-none ";
          if (!isSubmitted) {
             btnClass += selectedOption === index ? "bg-amber-100 border-amber-500 font-bold" : "bg-stone-50 hover:bg-stone-100 border-stone-300";
          } else {
            if (index === correctAnswerIndex) {
              btnClass += "bg-lime-100 border-lime-600 font-bold text-lime-900"; 
            } else if (index === selectedOption) {
              btnClass += "bg-rose-100 border-rose-500 font-bold text-rose-900"; 
            } else {
              btnClass += "bg-stone-50 border-stone-200 opacity-60";
            }
          }

          return (
            <button key={index} onClick={() => handleOptionSelect(index)} disabled={isSubmitted} className={btnClass}>
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  isSubmitted 
                    ? (index === correctAnswerIndex ? 'border-lime-600 bg-lime-600' : (index === selectedOption ? 'border-rose-500 bg-rose-500' : 'border-stone-300'))
                    : (selectedOption === index ? 'border-amber-500 bg-amber-500' : 'border-stone-400')
                }`}>
                  {isSubmitted && index === correctAnswerIndex && <span className="text-white text-xs">✓</span>}
                  {isSubmitted && index === selectedOption && index !== correctAnswerIndex && <span className="text-white text-xs">✗</span>}
                </div>
                <span className="text-sm md:text-base">{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {!isSubmitted && (
        <button onClick={handleSubmit} disabled={selectedOption === null} className="px-6 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors disabled:bg-stone-400 text-sm md:text-base">
          בדוק תשובה
        </button>
      )}

      {isSubmitted && (
        <div className={`mt-4 p-4 rounded-lg border-r-8 ${isCorrect ? 'bg-lime-50 border-lime-600' : 'bg-rose-50 border-rose-500'}`}>
          <h4 className={`font-bold mb-1 text-base md:text-lg ${isCorrect ? 'text-lime-900' : 'text-rose-900'}`}>
            {isCorrect ? 'כל הכבוד! תשובה נכונה.' : 'תשובה שגויה. הסבר:'}
          </h4>
          <div className="text-stone-800 text-sm md:text-base whitespace-pre-line leading-relaxed">{explanation}</div>
        </div>
      )}
    </div>
  );
};

// --- Pipette Component ---
const Pipette = ({ activeLiquid }) => {
  const isVisible = activeLiquid !== null;
  const liquidColor = activeLiquid === 'soap' ? 'bg-yellow-300' : (activeLiquid === 'h2o2' || activeLiquid === 'water') ? 'bg-sky-300' : 'bg-blue-100';
  
  return (
    <div className={`absolute -top-16 transition-all duration-500 z-40 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
      <div className="flex flex-col items-center">
        <div className="w-5 h-6 bg-red-700 rounded-t-full rounded-b-sm z-10 shadow-sm border border-red-900"></div>
        <div className="w-1.5 h-10 bg-white/70 border-x border-b border-stone-400 rounded-b-sm relative overflow-hidden shadow-sm -mt-0.5">
          <div className={`absolute bottom-0 w-full transition-all duration-[1500ms] ease-linear ${isVisible ? 'h-0' : 'h-full'} ${liquidColor}`}></div>
        </div>
        {isVisible && <div className={`absolute w-1 h-2 rounded-full ${liquidColor} animate-pipette-drop`} style={{ bottom: '-8px' }}></div>}
      </div>
    </div>
  );
};

// --- Part A Component ---
const PartA = () => {
  const [stage, setStage] = useState(0);
  const [showFoam, setShowFoam] = useState(false);
  const [showBubbles, setShowBubbles] = useState(false);
  const [animatingPipette, setAnimatingPipette] = useState(null);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);

  useEffect(() => {
    let timerFoam, timerBubbles;
    if (stage === 2) {
      setShowBubbles(true);
      timerFoam = setTimeout(() => setShowFoam(true), 1200);
      timerBubbles = setTimeout(() => setShowBubbles(false), 6000);
    } else {
      setShowBubbles(false);
      setShowFoam(false);
    }
    return () => { clearTimeout(timerFoam); clearTimeout(timerBubbles); };
  }, [stage]);

  const handleStage1 = () => {
    setIsBtnDisabled(true); setAnimatingPipette('soap');
    setTimeout(() => setStage(1), 600); 
    setTimeout(() => { setAnimatingPipette(null); setIsBtnDisabled(false); }, 2000); 
  };

  const handleStage2 = () => {
    setIsBtnDisabled(true); setAnimatingPipette('h2o2');
    setTimeout(() => setStage(2), 600);
    setTimeout(() => { setAnimatingPipette(null); setIsBtnDisabled(false); }, 2000);
  };

  const generateBubbles = (intensity) => {
    return Array.from({ length: intensity }).map((_, i) => (
      <div key={i} className="bubble z-20" style={{ width: `${Math.random()*6+3}px`, height: `${Math.random()*6+3}px`, left: `${Math.random()*80+10}%`, animationDuration: `${Math.random()*1.5+1}s`, animationDelay: `${Math.random()*2}s` }} />
    ));
  };

  const renderFoam = (sizeClass) => (
    <div className={`foam-layer ${sizeClass} overflow-hidden`} style={{ bottom: '52%' }}>
      {[...Array(50)].map((_, i) => (
        <div key={i} className="absolute bg-white rounded-full border border-stone-200 shadow-sm" style={{ width: `${Math.random()*10+5}px`, height: `${Math.random()*10+5}px`, top: `${Math.random()*110 - 5}%`, left: `${Math.random()*120 - 10}%`, opacity: 0.98 }} />
      ))}
    </div>
  );

  return (
    <div className="mb-8">
      <h2 className="text-xl md:text-2xl font-bold mb-3 text-amber-900 border-b-4 border-amber-200 pb-1.5">חלק א' - הכרת שיטה לבדיקת תהליך של פירוק מי חמצן</h2>
      <div className="bg-amber-50/70 p-4 rounded-xl mb-4 border-r-8 border-amber-400 shadow-sm text-sm md:text-base text-stone-800 leading-relaxed">
        <strong>תיאור הניסוי:</strong> התלמידים הכינו שלוש מבחנות (קטלאז, רסק עדשים, מים) והוסיפו לכל אחת מי סבון ומי חמצן כדי לבדוק היווצרות בועות או קצף.
      </div>

      <div className="bg-white border-2 border-stone-100 p-4 rounded-xl mb-6 flex flex-col items-center shadow-md">
        <h3 className="font-bold mb-4 text-stone-700 text-sm md:text-base">אנימציה חלק א'</h3>
        
        <div className="flex justify-center items-end gap-6 md:gap-12 mb-4 h-48 relative pt-20 mt-4 w-full">
          {[
            { name: 'קטלאז', color: 'bg-blue-100/80', foam: 'foam-large', count: 35 },
            { name: 'עדשים', color: 'bg-blue-100/60', foam: 'foam-medium', count: 18, isLentil: true },
            { name: 'מים', color: 'bg-blue-50' }
          ].map((tube, idx) => (
            <div key={idx} className="flex flex-col items-center relative">
              <Pipette activeLiquid={animatingPipette} />
              <div className="w-10 md:w-12 h-28 border-x-4 border-b-4 border-stone-400 relative overflow-hidden bg-white shadow-inner rounded-b-xl">
                <div className={`absolute bottom-0 w-full transition-all duration-1000 border-t-2 border-stone-200 z-10 ${tube.isLentil && stage === 0 ? 'bg-amber-100' : tube.color}`} 
                     style={{ height: stage === 0 ? '25%' : stage === 1 ? '48%' : '52%' }}>
                  {tube.isLentil && stage === 0 && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-3 bg-amber-700/30 rounded-full blur-[1px]"></div>}
                </div>
                {idx < 2 && showFoam && renderFoam(tube.foam)}
                {idx < 2 && showBubbles && generateBubbles(tube.count)}
              </div>
              <span className="mt-1 text-xs md:text-sm font-bold text-stone-700">{tube.name}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 w-full max-w-md mt-2">
          <button disabled={stage >= 1 || isBtnDisabled} onClick={handleStage1} className="flex-1 py-1.5 md:py-2 bg-stone-300 hover:bg-stone-400 text-stone-900 font-bold rounded-lg shadow text-xs md:text-sm disabled:opacity-50 border-b-2 border-stone-500">שלב 1: מי סבון</button>
          <button disabled={stage !== 1 || isBtnDisabled} onClick={handleStage2} className="flex-1 py-1.5 md:py-2 bg-stone-600 hover:bg-stone-700 text-white font-bold rounded-lg shadow text-xs md:text-sm disabled:opacity-50 border-b-2 border-stone-800">שלב 2: מי חמצן</button>
          <button onClick={() => {setStage(0); setShowFoam(false); setShowBubbles(false);}} className="px-3 py-1.5 md:py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-lg shadow text-xs md:text-sm border border-stone-300">איפוס</button>
        </div>

        <div className="mt-4 w-full">
          <table className="w-full text-center border-collapse bg-white rounded-lg overflow-hidden shadow-sm text-xs md:text-sm">
            <thead className="bg-amber-100 text-amber-900">
              <tr className="border-b border-amber-200">
                <th className="p-2 border-x border-amber-200">תכולת המבחנה</th>
                <th className="p-2 border-x border-amber-200">נפח מי סבון (מ"ל)</th>
                <th className="p-2 border-x border-amber-200">נפח מי חמצן (מ"ל)</th>
              </tr>
            </thead>
            <tbody className="text-stone-700">
              <tr className="border-b border-stone-100"><td className="p-2 border-x font-bold">קטלאז (1 מ"ל)</td><td className="p-2 border-x">{stage >= 1 ? '4' : '-'}</td><td className="p-2 border-x">{stage >= 2 ? '1' : '-'}</td></tr>
              <tr className="border-b border-stone-100"><td className="p-2 border-x font-bold">רסק עדשים</td><td className="p-2 border-x">{stage >= 1 ? '4' : '-'}</td><td className="p-2 border-x">{stage >= 2 ? '1' : '-'}</td></tr>
              <tr><td className="p-2 border-x font-bold">מים (1 מ"ל)</td><td className="p-2 border-x">{stage >= 1 ? '4' : '-'}</td><td className="p-2 border-x">{stage >= 2 ? '1' : '-'}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <MultipleChoiceQnA 
        qNum="1. א" 
        question="מהי הכותרת המתאימה ביותר לטבלה המסכמת את מערך הניסוי שערכתם בחלק א'?" 
        options={[
          "השפעת ריכוז מי החמצן על קצב היווצרות הבועות במבחנות שונות.",
          "בדיקת כמות המים המזוקקים הדרושה לפירוק האנזים קטלאז בסביבה סבונית.",
          "השפעת חומרים שונים על פעילות הקטלאז (היווצרות בועות/קצף).",
          "קצב יצירת קצף סבון בנוכחות תמיסות שונות של מלח ורסק עדשים."
        ]}
        correctAnswerIndex={2}
        explanation={`הניסוי בודק השפעה של חומרים שונים (קטלאז, רסק עדשים ומים כבקרה) על התגובה של פירוק מי חמצן.`} 
      />

      <MultipleChoiceQnA 
        qNum="1. ב" 
        question="על סמך התוצאות שהתקבלו באנימציה של הניסוי, מהו הדירוג הנכון של המבחנות לפי כמות הקצף שנוצר בהן (מהכמות הגדולה ביותר לכמות הקטנה ביותר או היעדר קצף)?" 
        options={[
          "מים > רסק עדשים > קטלאז",
          "רסק עדשים > קטלאז > מים",
          "קטלאז > מים > רסק עדשים",
          "קטלאז > רסק עדשים > מים"
        ]}
        correctAnswerIndex={3}
        explanation={`קטלאז > רסק עדשים > מים. במבחנת הקטלאז נוצרה כמות הקצף הגדולה ביותר. במבחנת רסק העדשים נוצר קצף, אך בכמות קטנה יותר בהשוואה לקטלאז. במבחנת המים לא נוצר קצף כלל (0).`} 
      />
      
      <MultipleChoiceQnA 
        qNum="2. א" 
        question="מהו ההסבר הנכון לתוצאות שהתקבלו בכל אחת משלוש המבחנות?" 
        options={[
          "הסבון פירק את הקטלאז במבחנות והוביל ליצירת בועות.",
          "קטלאז מעכב את פירוק מי החמצן במבחנה. במים המזוקקים אין קטלאז כלל, ולכן נוצרו שם בועות חמצן באופן טבעי.",
          "קטלאז מזרז פירוק מי חמצן. במבחנת הקטלאז ובעדשים (שמכילות קטלאז) נוצרו בועות.",
          "נבטי העדשים מפרקים את הקטלאז במבחנה ולכן ראינו פחות בועות."
        ]}
        correctAnswerIndex={2}
        explanation={`קטלאז מזרז פירוק מי חמצן למים ולחמצן. החמצן שנוצר משתחרר בצורת בועות/קצף בנוכחות הסבון.`} 
      />

      <MultipleChoiceQnA 
        qNum="2. ב" 
        question='מה היו עשויות להיות התוצאות במבחנה המסומנת "עדשים" אילו תמיסת מי החמצן שהוספתם הייתה בריכוז גבוה יותר, ומהו ההסבר לכך?' 
        options={[
          "קצב יצירת הקצף היה איטי הרבה יותר בגלל עיכוב תחרותי.",
          "לא היה נצפה כל שינוי משמעותי בתוצאות בגלל נוכחות הסבון.",
          "נוצרו פחות בועות חמצן בגלל דנטורציה של האנזים בריכוז גבוה.",
          "קצב הפירוק היה מהיר יותר ונוצרו יותר בועות (עד לרוויה)."
        ]}
        correctAnswerIndex={3}
        explanation={`עלייה בריכוז סובסטרט (מי חמצן), גורמת לעליה בסיכויי המפגשים בין אנזים לסובסטרט, וקצב הפירוק מהיר יותר.`} 
      />

      <MultipleChoiceQnA 
        qNum="3." 
        question="נתון: תלמיד קיבל כלי ובו 10 מ''ל תמיסת מלח בריכוז 10%. התלמיד הוסיף לכלי 30 מ''ל מים מזוקקים. מהו ריכוז התמיסה שהתקבלה?" 
        options={["2.5%", "5%", "7.5%", "10%"]}
        correctAnswerIndex={0}
        explanation={`התשובה: 2.5%. 
פירוט החישוב לפי הנוסחה C₁ × V₁ = C₂ × V₂:
C₁ = הריכוז ההתחלתי (10%)
V₁ = הנפח ההתחלתי (10 מ"ל)
C₂ = הריכוז הסופי (הנעלם X)
V₂ = הנפח הסופי הכולל (10 מ"ל + 30 מ"ל מים = 40 מ"ל)
הצבה בנוסחה: 10 × 10 = X × 40
100 = 40X
X = 2.5%

או הסבר מילולי: ל-10 מ"ל תמיסת מלח בריכוז 10% הוסיפו 30 מ"ל מים, כלומר מהלו את התמיסה פי 4 (הנפח הסופי הוא 40 מ"ל), ולכן הריכוז ירד פי 4.`} 
      />
    </div>
  );
};

// --- Part B Component ---
const PartB = () => {
  const [stageB, setStageB] = useState(0); 
  const [animatingPipettesB, setAnimatingPipettesB] = useState(false);
  const [isBtnDisabledB, setIsBtnDisabledB] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [round, setRound] = useState(0);
  const [timers, setTimers] = useState({ a: 0, b: 0, c: 0, d: 0 });
  const [diskStates, setDiskStates] = useState({ a: 15, b: 15, c: 15, d: 15 });
  const [isRising, setIsRising] = useState({ a: false, b: false, c: false, d: false });
  const [results, setResults] = useState({ a: [], b: [], c: [], d: [] });

  const timesByRound = [{ a: 27, b: 33, c: 35, d: 45 }, { a: 25, b: 32, c: 40, d: 45 }, { a: 31, b: 30, c: 34, d: 45 }];

  const handleStage1B = () => setStageB(1);
  const handleStage2B = () => {
    setIsBtnDisabledB(true); setAnimatingPipettesB(true);
    setTimeout(() => setStageB(2), 600);
    setTimeout(() => { setAnimatingPipettesB(false); setIsBtnDisabledB(false); }, 2000);
  };
  const handleStage3B = () => setStageB(3);
  
  const handleStage4B = () => {
    if (stageB < 4) setStageB(4);
    if (!isRunning && round < 3) setIsRunning(true);
  };

  useEffect(() => {
    let intervals = [];
    if (isRunning && round < 3 && stageB >= 4) {
      setIsRising({ a: false, b: false, c: false, d: false });
      setDiskStates({ a: 15, b: 15, c: 15, d: 15 });
      setTimers({ a: 0, b: 0, c: 0, d: 0 });
      const currentTimes = timesByRound[round];
      let completed = 0;
      
      ['a', 'b', 'c', 'd'].forEach(tube => {
        const duration = currentTimes[tube];
        let tick = 0;
        const interval = setInterval(() => {
          tick++; 
          setTimers(prev => ({...prev, [tube]: tick}));
          
          // שחרור הדיסקיות מיד בהתחלה
          if (tick === 1) {
             setDiskStates(prev => ({...prev, [tube]: 85}));
          }

          // הדיסקיות הגיעו לקרקעית - מתחילות לעלות
          if (tick === 5) {
             if (tube !== 'd') {
               setIsRising(prev => ({...prev, [tube]: true}));
               setDiskStates(prev => ({...prev, [tube]: 15}));
             }
          }

          // הגעה לזמן היעד המדויק
          if (tick >= duration || (tube === 'd' && tick >= 40)) {
            clearInterval(interval); 
            completed++;
            if (tube !== 'd') {
              setIsRising(prev => ({...prev, [tube]: false}));
              setDiskStates(prev => ({...prev, [tube]: 15})); 
            }
            if (completed === 4) {
              setTimeout(() => {
                setResults(p => ({ 
                  a: [...p.a, currentTimes.a], 
                  b: [...p.b, currentTimes.b], 
                  c: [...p.c, currentTimes.c], 
                  d: [...p.d, 'לא צפה'] 
                }));
                setRound(r => r + 1); 
                setIsRunning(false);
                // החזרת הדיסקיות למעלה (כולל ד') לקראת ההטלה הבאה
                setIsRising({ a: false, b: false, c: false, d: false });
                setDiskStates({ a: 15, b: 15, c: 15, d: 15 });
              }, 1200);
            }
          }
        }, 100);
        intervals.push(interval);
      });
    }
    return () => intervals.forEach(clearInterval);
  }, [isRunning, round, stageB]);

  const resetB = () => {
    setIsRunning(false); setRound(0); setStageB(0); setResults({ a: [], b: [], c: [], d: [] });
    setTimers({ a: 0, b: 0, c: 0, d: 0 }); setDiskStates({ a: 15, b: 15, c: 15, d: 15 });
    setIsRising({ a: false, b: false, c: false, d: false });
  };

  const getAvg = (arr) => arr.includes('לא צפה') ? 'לא צפה' : Math.round(arr.reduce((a,b)=>a+b,0)/arr.length);

  const getStageBText = () => {
    const texts = [
      "לחצו על '1: סימון' להתחלת בניית מערך הניסוי.",
      "שלב 1: סימון המבחנות בקו המרוחק 3 ס\"מ משפת המבחנה.",
      "שלב 2: הוספת מי חמצן (א-ג) ומים (ד) עד לקו בעזרת פיפטה.",
      "שלב 3: טבילת דיסקיות נייר במיצויים של עדשים שהושרו בריכוזי מלח שונים (0%,2%,4%) והנחת הדיסקיות על פני הנוזל.",
      "שלב 4: שחרור הדיסקיות שלוש פעמים וחישוב ממוצע משך זמן הציפה."
    ];
    return texts[stageB] || "";
  };

  const renderDiskBubbles = (tubeId) => {
    if (tubeId === 'd' || !isRising[tubeId]) return null;
    return (
      <div className="absolute -bottom-3 w-full h-8 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bubble" style={{ 
            width: `${3 + (i%3)}px`, height: `${3 + (i%3)}px`, 
            left: `${-5 + (i*8)}%`, bottom: '0px', 
            animationDuration: `${0.3 + (i%3)*0.1}s`, 
            animationDelay: `${(i%2)*0.1}s` 
          }}/>
        ))}
      </div>
    );
  };

  return (
    <div className="mb-10">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-amber-900 border-b-4 border-amber-200 pb-2">חלק ב' - בדיקת פעילות קטלאז מתאי נבטי עדשים</h2>
      
      <div className="bg-amber-50/70 p-4 md:p-5 rounded-xl mb-6 border-r-4 border-amber-400 shadow-sm">
        <h3 className="font-bold text-amber-900 mb-2 text-base md:text-lg">מהלך הניסוי של התלמידים:</h3>
        <p className="text-stone-700 leading-relaxed text-sm md:text-base">
          התלמידים עבדו עם נבטי עדשים שהונבטו מראש במשך יומיים בשלוש תמיסות של המלח נתרן כלורי (NaCl) בריכוזים: 0%, 2%, ו-4%. התלמידים כתשו את הנבטים מכל ריכוז בנפרד (יחד עם תמיסת בופר) וסיננו אותם לקבלת מיצויים.
        </p>
      </div>

      <div className="bg-amber-100 p-4 md:p-5 rounded-xl mb-6 border-r-4 border-amber-500 shadow-sm">
        <h3 className="font-bold text-amber-900 mb-1 text-base md:text-lg">לידיעתכם 1:</h3>
        <p className="text-stone-800 text-sm md:text-base">
          בתמיסה מימית המלח נתרן כלורי (NaCl) מתפרק ליונים. יוני הנתרן חודרים לתאים ומשפיעים על המבנה המרחבי של החלבונים.
        </p>
      </div>

      <div className="bg-white border-2 border-stone-100 p-4 md:p-5 rounded-2xl mb-6 flex flex-col items-center shadow-md">
        <h3 className="font-bold mb-4 text-stone-700 text-sm md:text-base text-center">אנימציית הניסוי: מדידת זמן הציפה</h3>
        
        <div className="flex justify-center items-end gap-5 md:gap-10 mb-4 h-48 relative pt-24 mt-8 w-full">
          {[{id:'a', label:'א', ex:'0%'}, {id:'b', label:'ב', ex:'2%'}, {id:'c', label:'ג', ex:'4%'}, {id:'d', label:'ד', ex:'0%', type:'water'}].map(t => (
            <div key={t.id} className="flex flex-col items-center relative">
              <Pipette activeLiquid={animatingPipettesB ? (t.type === 'water' ? 'water' : 'h2o2') : null} />
              
              {stageB >= 3 && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[120%] text-[10px] md:text-xs font-extrabold text-amber-900 whitespace-nowrap z-50">
                  מיצוי {t.ex}
                </div>
              )}
              
              <div className="w-12 md:w-14 h-32 border-x-4 border-b-4 border-stone-400 relative bg-white overflow-hidden rounded-b-xl shadow-inner">
                <div className={`absolute w-full h-0.5 bg-red-600/80 z-20 transition-opacity duration-500 ${stageB >= 1 ? 'opacity-100' : 'opacity-0'}`} style={{ top: '15%' }}></div>
                <div className={`absolute bottom-0 w-full ${t.type==='water'?'bg-blue-50/60':'bg-blue-100/60'} border-t-2 border-stone-200 z-10 transition-all duration-1000`} style={{ height: stageB >= 2 ? '85%' : '0%' }}></div>
                
                <div className={`disk absolute w-8 md:w-10 h-1.5 bg-stone-700 rounded-full left-1/2 -translate-x-1/2 z-30 transition-all ${stageB >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} 
                     style={{ 
                       top: `${diskStates[t.id]}%`, 
                       transition: `top ${isRising[t.id] ? ((timesByRound[round]?.[t.id] || 40) - 5) * 0.1 + 's' : '0.4s'} linear, opacity 0.5s` 
                     }}>
                   {renderDiskBubbles(t.id)}
                </div>
              </div>
              <span className="mt-1 text-xs md:text-sm font-bold text-stone-800">מבחנה {t.label}</span>
              <span className={`text-xs md:text-sm font-mono mt-0.5 text-stone-900 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-300 transition-opacity ${stageB >= 4 ? 'opacity-100' : 'opacity-0'}`}>
                {t.id === 'd' && timers[t.id] >= 40 ? 'לא צפה' : `${timers[t.id]}s`}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-orange-50 px-4 py-2 rounded-lg mb-3 mt-4 text-center border border-amber-200 w-full max-w-2xl min-h-[2.5rem] flex items-center justify-center shadow-sm">
          <p className="text-sm md:text-base text-amber-900 font-bold leading-tight">{getStageBText()}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 w-full max-w-xl py-1">
          <button disabled={stageB >= 1 || isBtnDisabledB} onClick={handleStage1B} className="w-[31%] md:w-auto md:flex-1 py-2 md:py-1.5 bg-stone-300 hover:bg-stone-400 text-stone-900 font-bold rounded-lg shadow-sm text-[11px] md:text-sm leading-tight whitespace-normal md:whitespace-nowrap disabled:opacity-50 border-b-2 border-stone-500">1: סימון</button>
          <button disabled={stageB !== 1 || isBtnDisabledB} onClick={handleStage2B} className="w-[31%] md:w-auto md:flex-1 py-2 md:py-1.5 bg-stone-300 hover:bg-stone-400 text-stone-900 font-bold rounded-lg shadow-sm text-[11px] md:text-sm leading-tight whitespace-normal md:whitespace-nowrap disabled:opacity-50 border-b-2 border-stone-500">2: מי חמצן ומים</button>
          <button disabled={stageB !== 2 || isBtnDisabledB} onClick={handleStage3B} className="w-[31%] md:w-auto md:flex-1 py-2 md:py-1.5 bg-stone-500 hover:bg-stone-600 text-white font-bold rounded-lg shadow-sm text-[11px] md:text-sm leading-tight whitespace-normal md:whitespace-nowrap disabled:opacity-50 border-b-2 border-stone-700">3: דיסקיות</button>
          <button disabled={stageB < 3 || isRunning || round >= 3} onClick={handleStage4B} className="w-[47%] md:w-auto md:flex-1 py-2 md:py-1.5 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-lg shadow-md text-[11px] md:text-sm leading-tight whitespace-normal md:whitespace-nowrap disabled:opacity-50 border-b-2 border-black">
            {round >= 3 ? "סיום ניסוי" : stageB < 4 ? "4: שחרור" : `שחרור (${round+1}/3)`}
          </button>
          <button onClick={resetB} className="w-[47%] md:w-auto md:px-3 py-2 md:py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold rounded-lg shadow border border-stone-300 text-[11px] md:text-sm leading-tight">איפוס</button>
        </div>

        <div className="mt-4 w-full">
          <h4 className="font-bold mb-2 text-center text-amber-900 text-sm md:text-base">טבלה 2: סיכום המדידות (משך זמן הציפה בשניות)</h4>
          <table className="w-full text-center border-collapse bg-white rounded-lg overflow-hidden shadow-sm text-[11px] md:text-sm">
            <thead className="bg-amber-100 text-amber-900">
              <tr className="border-b border-amber-200">
                <th className="p-1.5 md:p-2 border-x border-amber-200" rowSpan="2">מבחנה</th>
                <th className="p-1.5 md:p-2 border-x border-amber-200" rowSpan="2">ריכוז תמיסת מלח בו הושרו העדשים (%)</th>
                <th className="p-1.5 md:p-2 border-x border-amber-200" rowSpan="2">מי חמצן (-/+)</th>
                <th className="p-1 md:p-2 border-x border-amber-200" colSpan="3">מדידות זמן הציפה (שניות)</th>
                <th className="p-1.5 md:p-2 border-x border-amber-200 bg-amber-200" rowSpan="2">ממוצע (שניות)</th>
              </tr>
              <tr className="bg-amber-50">
                <th className="p-1 border-x border-amber-200">מדידה I</th>
                <th className="p-1 border-x border-amber-200">מדידה II</th>
                <th className="p-1 border-x border-amber-200">מדידה III</th>
              </tr>
            </thead>
            <tbody>
              {['a','b','c','d'].map((t, i) => (
                <tr key={t} className="border-b border-stone-100">
                  <td className="p-1.5 border-x font-bold uppercase">{['א','ב','ג','ד'][i]}</td>
                  <td className="p-1.5 border-x">{[0,2,4,0][i]}</td>
                  <td className="p-1.5 border-x font-bold">{i<3?'+':'-'}</td>
                  <td className="p-1.5 border-x">{results[t][0] || '-'}</td>
                  <td className="p-1.5 border-x">{results[t][1] || '-'}</td>
                  <td className="p-1.5 border-x">{results[t][2] || '-'}</td>
                  <td className="p-1.5 border-x bg-amber-50 font-bold text-amber-900">{results[t].length===3?getAvg(results[t]):'-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-amber-100 p-4 md:p-5 rounded-xl mb-6 mt-6 border-r-4 border-amber-500 shadow-sm">
        <h3 className="font-bold text-amber-900 mb-1 text-base md:text-lg">לידיעתכם 2:</h3>
        <p className="text-stone-800 text-sm md:text-base">
          דסקיות הנייר צפות בגלל שחרור של בועות גז.
        </p>
      </div>

      <MultipleChoiceQnA 
        qNum="4" 
        question="בכל אחת מן המבחנות א-ד נערכו שלוש מדידות. מדוע חשוב לבצע חזרות בניסוי זה?" 
        options={[
          "ביצוע חזרות מאפשר להקטין את ההשפעה של טעות מקרית או של תוצאה חריגה.",
          "מטרתן להוכיח שציפת הדסקית מושפעת אך ורק מריכוז המלח ולא מכל גורם אחר.",
          "הן מגדילות את כמות מי החמצן המפורקת באופן מצטבר לאורך כל הניסוי.",
          "חזרות מונעות מהדסקית לספוג כמות עודפת של מים שעלולה להטות את הזמן."
        ]}
        correctAnswerIndex={0}
        explanation={`ייתכן שבמדידה אחת נפלה טעות והיא אינה מייצגת / ביצוע חזרות מאפשר להקטין השפעה של תוצאה חריגה. הממוצע מייצג את התוצאות באופן מהימן.`} 
      />

      <MultipleChoiceQnA 
        qNum="5. א" 
        question="מהי הכותרת המתאימה ביותר לטבלה 2?" 
        options={[
          "השפעת ריכוז מי החמצן במבחנה על קצב פעילות האנזים קטלאז בזרעי שעועית.",
          "השפעת ריכוז תמיסת המלח (NaCl) שבה הונבטו העדשים על קצב פעילות קטלאז.",
          "משך זמן ציפת הדסקית כפונקציה של כמות מי הסבון שהוספה לכל מבחנה בניסוי.",
          "בדיקת כמות המים המזוקקים הנדרשת לפירוק האנזים קטלאז בנבטי עדשים שונים."
        ]}
        correctAnswerIndex={1}
        explanation={`כותרת לטבלה צריכה לכלול שלושה מרכיבים: 1. התייחסות למשתנה הבלתי תלוי: ריכוז [תמיסת] מלח. 2. התייחסות למשתנה התלוי או לדרך המדידה משך ציפת דסקית / [קצב] פירוק מי חמצן / [קצב] פעילות קטלאז/אנזים. 3. התייחסות לאורגניזם: עדשים.`} 
      />

      <MultipleChoiceQnA 
        qNum="5. ב" 
        question="מהו המשתנה הבלתי תלוי בניסוי שערכתם בחלק ב?" 
        options={[
          "משך הזמן שלקח לדסקיות הנייר לצוף בחזרה למעלה בכל אחת מן המדידות.",
          "קצב פעילות האנזים קטלאז כפי שחושב על ידי התלמידים בתום שלב התצפית.",
          "ריכוז תמיסת המלח (NaCl) שבה הונבטו נבטי העדשים לפני תחילת הניסוי.",
          "נפח מי החמצן שהוסף לכל אחת מן המבחנות במהלך מערך הבדיקה עצמו."
        ]}
        correctAnswerIndex={2}
        explanation={`ריכוז [תמיסת] המלח [שבה הונבטו העדשים].`} 
      />

      <MultipleChoiceQnA 
        qNum="6. א" 
        question="מהו המשתנה התלוי בניסוי שערכתם בחלק ב?" 
        options={[
          "כמות המים המזוקקים שהוספה למבחנת הבקרה במטרה לשמור על נפח קבוע.",
          "ריכוז תמיסת המלח ששימשה להנבטת זרעי העדשים לאורך שני ימי ההנבטה.",
          "קצב פעילות האנזים קטלאז (או קצב פירוק מי חמצן) הנמדד באמצעות ציפה.",
          "מספר נבטי העדשים שנכתשו עבור הכנת המיצוי לכל אחת מארבע המבחנות."
        ]}
        correctAnswerIndex={2}
        explanation={`קצב / מידת , פעילות אנזים / פעילות קטלאז / פירוק מי חמצן. (קצב יצירת/פליטת חמצן).`} 
      />

      <MultipleChoiceQnA 
        qNum="6. ב" 
        question="מדוע מדידת משך זמן הציפה היא דרך מתאימה למדידת המשתנה התלוי?" 
        options={[
          "הדסקית מתפרקת לאיטה במהלך הניסוי וצפה רק כשהיא הופכת קלה מספיק לשם כך.",
          "האנזים מפרק מי חמצן לחמצן. ככל שהפעילות מהירה, נוצר יותר גז שמציף את הדסקית.",
          "מים מזוקקים דוחפים את הדסקית למעלה בכוח רב יותר ככל שיש פחות מלח במבחנה.",
          "הדסקית סופגת מלח והופכת לכבדה יותר ככל שיש יותר מלח בתמיסה שבה היא הוטבלה."
        ]}
        correctAnswerIndex={1}
        explanation={`ככל שקצב פעילות האנזים / קטלאז, מהיר יותר/ קצב פירוק מי חמצן גבוה יותר, משתחרר יותר גז/חמצן, והדסקית תצוף מהר יותר / הזמן עד לציפת הדסקית קצר יותר.`} 
      />

      <MultipleChoiceQnA 
        qNum="7." 
        question="על סמך המידע על השפעת המלח נתרן כלורי על חלבונים (לידיעתכם 1), מהו ההסבר לתוצאות הניסוי?" 
        options={[
          "במבחנה ד' (0% מלח ומים) הדסקית לא צפה כלל מכיוון שהמלח הוא הגורם המרכזי שמזרז את התגובה הכימית של פירוק מי החמצן.",
          "יוני הנתרן משמשים כסובסטרט מתחרה למי החמצן, ולכן בריכוז 4% פעילות האנזים התעכבה משמעותית בגלל התחרות על האתר הפעיל.",
          "המלח גורם לעדשים לספוג הרבה פחות מים, ולכן הדסקית הייתה כבדה יותר במלח בריכוז 4% ולקח לה יותר זמן לצוף למעלה.",
          "ככל שריכוז המלח גבוה יותר, יוני נתרן חודרים לתאים וגורמים לדנטורציה של הקטלאז. הפעילות יורדת והדסקית צפה לאט יותר."
        ]}
        correctAnswerIndex={3}
        explanation={`ככל שריכוז המלח בתמיסות ההנבטה גבוה יותר, כך יותר יוני נתרן חודרים לתאים וגורמים לפגיעה / לשינוי במבנה המרחבי / לדנטורציה, בחלבונים/אנזימים. לכן יש ירידה בפעילות קטלאז / בפירוק מי חמצן, נוצרות פחות בועות גז והדסקית צפה לאט יותר. במבחנת הבדיקה ד' אין מי חמצן, לכן לא נוצרות בועות והדסקית לא צפה.`} 
      />

      <MultipleChoiceQnA 
        qNum="8. א" 
        question="הטיפול שנבדק במבחנה ד הוא טיפול בקרה. מהי החשיבות של טיפול הבקרה בניסוי זה?" 
        options={[
          "להוכיח שהציפה של הדסקית מושפעת גם מהימצאות מי חמצן בתמיסה.",
          "להוכיח שהציפה של הדסקית מושפעת גם מהימצאות האנזים קטלאז בתוך תמיסת הבדיקה.",
          "להוכיח שמשך זמן הציפה של הדסקית יכול להיות יותר מ-120 שניות תחת תנאי הניסוי.",
          "להוכיח שמשך זמן הציפה של הדסקית מושפע מכמות המיצוי המדויקת שנמצאת על הדסקית."
        ]}
        correctAnswerIndex={0}
        explanation={`להוכיח שהציפה של הדסקית מושפעת גם מהימצאות מי חמצן בתמיסה.
למורה: במבחנה ד נבדקה ציפת דסקית שהוטבלה במיצוי מנבטים שנבטו ללא מלח, והדסקית הוטבלה במים. חשיבות טיפול בקרה הוא שלילת הסבר חלופי. ההסבר החלופי שבקרה זו מאפשרת לשלול הוא: ריכוז המלח שמומס במיצוי משפיע באופן פיזיקלי (בגלל הבדל בצפיפות התמיסה) על קצב ציפת הדסקיות, ואינו מושפע ממידת פעילות קטלאז שבמיצוי הנבטים על מי חמצן.
ניסוי זה עלול להיות מסובך לתלמידים ולכן בחרנו בניסוח פשוט, במשפט חיובי, המתייחס להיעדר מי חמצן במבחנת הבקרה.`} 
      />

      <MultipleChoiceQnA 
        qNum="8. ב" 
        question="בניסוי שערכתם בחלק ב יש טיפול בקרה נוסף. מהו טיפול הבקרה הנוסף? מדוע חשוב לכלול גם אותו בניסוי זה?" 
        options={[
          "מבחנה ג' (4% מלח). היא מהווה בקרה משום שהיא מציגה את מצב העקה הקיצוני ביותר שיש להשוות אליו.",
          "מבחנה ב' (2% מלח). היא משמשת כמצב ביניים המעיד על כך שהשינוי בקצב הפעילות הוא שינוי הדרגתי.",
          "אין טיפול בקרה נוסף. מבחנה ד' היא הבקרה היחידה שמוכיחה את קיום התגובה בעזרת מים מזוקקים טהורים.",
          "מבחנה א' (0% מלח). בקרה זו נועדה לשלול הסבר חלופי ולוודא שההבדל בפעילות נובע רק מריכוז המלח."
        ]}
        correctAnswerIndex={3}
        explanation={`מבחנת בדיקה א [היא טיפול בקרה] לוודא [שריכוז] המלח הוא הגורם המשפיע על פעילות האנזים / מהירות ציפת הדסקיות.`} 
      />

      <MultipleChoiceQnA 
        qNum="9. א" 
        question="אילו גורמים נשמרו קבועים בניסוי שערכתם?" 
        options={[
          "ריכוז המלח בתמיסת ההשריה והנפח המדויק של המים המזוקקים במבחנות.",
          "סוג הזרעים (עדשים), טמפרטורת החדר, ריכוז האנזים ונפח מי החמצן.",
          "קצב יצירת בועות החמצן, צבע הזרעים ואופן הכנת המיצוי בכל מבחנה.",
          "זמן ציפת הדסקית, ריכוז האנזים קטלאז ועוצמת האור בחדר המעבדה."
        ]}
        correctAnswerIndex={1}
        explanation={`סוג הזרעים/נבטים, טמפרטורה [של מי חמצן/התמיסה במבחנת הבדיקה], משך זמן ההנבטה, דרגת pH [של תמיסת הנבטה / תמיסת מי חמצן], גודל הדסקית / נפח המיצוי שנספג על הדסקית, ריכוז מי חמצן, נפח הנוזל / גודל המבחנה.`} 
      />

      <MultipleChoiceQnA 
        qNum="9. ב" 
        question="הסבירו מדוע היה חשוב שטמפרטורת החדר תישאר קבועה בניסוי שערכתם." 
        options={[
          "נפח הנוזל במבחנה נוטה להשתנות בעקבות טמפרטורה ולכן יש לקבע אותה בניסוי.",
          "כדי שהמים לא ירתחו ויגרמו לנזק מבני בלתי הפיך לסיבי דסקית הנייר במהלך הניסוי.",
          "הטמפרטורה משפיעה על קצב הפעילות האנזימטית ולכן רק המלח אמור להשפיע בניסוי.",
          "טמפרטורה גבוהה מדי גורמת למלח להתאדות מהתמיסה וכך משנה את ריכוזו המדויק."
        ]}
        correctAnswerIndex={2}
        explanation={`טמפרטורה משפיעה על קצב תהליכים אנזימטיים / קצב פירוק מי חמצן. בניסוי נבדקה ההשפעה של גורם אחר / משתנה בלתי תלוי אחר / ריכוזים שונים של תמיסות מלח, [ולכן כל שאר הגורמים צריכים להישמר קבועים].`} 
      />
    </div>
  );
};

// --- Part C Component ---
const PartC = () => {
  return (
    <div className="mb-12">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-amber-900 border-b-4 border-amber-200 pb-2">חלק ג' - התאמות של צמח היבלית</h2>
      
      {/* פתיח חלק ג' */}
      <div className="bg-amber-50/70 p-4 md:p-5 rounded-xl mb-6 border-r-8 border-amber-400 shadow-sm text-sm md:text-base text-stone-800 leading-relaxed">
        <p className="mb-2">
          בשטחים חקלאיים שמשקים אותם במי קולחין (מי שפכים שעברו טיהור) יש עלייה בריכוז המלחים בקרקע. גורם נוסף לעלייה בריכוז המלחים בקרקע הוא התאדות רבה של המים שבקרקע.<br/>
          ריכוז גבוה של מלחים בקרקע הוא אחד הגורמים האביוטיים המשפיעים על התפתחות צמחים.
        </p>
        <p className="mb-4">
          חוקרים מצאו זנים של צמחי יבלית שמותאמים לתנאי מליחות, כלומר הם יכולים להתפתח בקרקעות שיש בהן ריכוז גבוה של מלחים. הבנה של מנגנוני ההתאמה של צמחים לתנאי מליחות תסייע לפתח צמחים שיוכלו לגדול בתנאים אלה.
        </p>
        <p className="mb-2 font-bold underline decoration-amber-300 decoration-2 underline-offset-4">ניסוי 1:</p>
        <p>
          החוקרים גידלו צמחי יבלית בני אותו גיל משני זנים — זן א' וזן ב' — בתמיסות שבהן ריכוזים שונים של המלח NaCl.<br/>
          לאחר שלושה שבועות הם הכינו מיצויים מן הצמחים משני הזנים, ומדדו את הריכוז של מי החמצן (H₂O₂) במיצויים.<br/>
          מי החמצן הם תוצר לוואי בתהליך הנשימה התאית, והם רעילים לתאים.<br/>
          תוצאות הניסוי מוצגות בטבלה 3 שלהלן.
        </p>
      </div>

      <div className="bg-white p-4 md:p-5 border border-stone-200 rounded-xl shadow-sm mb-6 max-w-2xl mx-auto">
        <h4 className="font-bold text-center mb-3 text-amber-900 text-sm md:text-base">טבלה 3: ניסוי 1 - ריכוז מי חמצן במיצוי (יחידות יחסיות)</h4>
        <table className="w-full text-center border-collapse text-sm md:text-base">
          <thead>
            <tr className="bg-amber-100 border-b-2 border-amber-200 text-amber-900">
              <th className="p-2 border-l border-amber-200 w-1/3">ריכוז המלח (%)</th>
              <th className="p-2 border-l border-amber-200 w-1/3">זן א'</th>
              <th className="p-2 w-1/3">זן ב'</th>
            </tr>
          </thead>
          <tbody>
            {[
              [0, 2.5, 2.5],
              [0.3, 2.3, 2.5],
              [0.5, 2.7, 2.5],
              [0.7, 2.3, 3.5],
              [1.0, 2.4, 4.7]
            ].map((row, i) => (
              <tr key={i} className="border-b hover:bg-stone-50">
                <td className="p-2 border-l border-stone-200 font-bold">{row[0]}</td>
                <td className="p-2 border-l border-stone-200">{row[1]}</td>
                <td className="p-2">{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <MultipleChoiceQnA 
        qNum="10. א" 
        question="איזה מסיח מתאר בצורה הטובה ביותר את התוצאות המוצגות בטבלה 3?" 
        options={[
          "בזן א' הריכוז נשאר נמוך וקבוע, בעוד שבזן ב' חלה עלייה חדה החל מ-0.7% מלח.",
          "בשני הזנים גם יחד חלה עלייה זהה בריכוז מי החמצן ככל שריכוז המלח עלה.",
          "בזן ב' הריכוז נשאר יציב, ובזן א' חלה עלייה דרמטית.",
          "בריכוזי מלח גבוהים חלה ירידה בריכוז מי החמצן בשני הזנים."
        ]}
        correctAnswerIndex={0}
        explanation={`בזן א' הריכוז נשאר סביב 2.3-2.7 יחידות יחסיות (נמוך וללא שינוי מגמתי), בעוד שבזן ב' הריכוז מזנק מ-2.5 ל-3.5 (בריכוז 0.7% מלח) ואף מגיע ל-4.7 (ב-1.0% מלח).`} 
      />

      <MultipleChoiceQnA 
        qNum="10. ב" 
        question="איזה סוג גרף מתאים ביותר להצגת נתוני טבלה 3?" 
        options={[
          "דיאגרמת עמודות, כי אלו קבוצות שונות.", 
          "גרף רציף (קו/פיזור), כי ריכוז המלח הוא משתנה כמותי רציף.", 
          "גרף עוגה, להצגת החלק היחסי של כל זן.", 
          "אין אפשרות להציג נתונים אלו בגרף."
        ]}
        correctAnswerIndex={1}
        explanation={`גרף רציף / פיזור. נימוק: המשתנה הבלתי תלוי (ריכוז מלח / NaCl), הוא משתנה רציף / כמותי.`} 
      />

      <div className="bg-white p-4 md:p-5 border-2 border-stone-100 rounded-2xl shadow-md mb-6 flex flex-col items-center justify-center">
        <div className="text-right w-full mb-4 px-2">
           <h4 className="font-bold text-stone-800 text-base md:text-lg mb-1">ניסוי 2:</h4>
           <p className="text-stone-700 text-sm md:text-base">
             החוקרים בדקו את קצב הפעילות של האנזים קטלאז בשני הזנים של צמחי היבלית שהם גידלו.<br/>
             תוצאות הניסוי מתוארות בגרף שלהלן.
           </p>
        </div>
        
        {/* הגרף עם כל המרכיבים */}
        <div className="w-full max-w-3xl bg-white rounded-xl p-1 md:p-2 ltr border border-stone-100 relative">
          <svg viewBox="0 0 650 350" className="w-full h-auto">
            {/* כותרת הגרף */}
            <text x="280" y="25" fontSize="16" fill="#1c1917" textAnchor="middle" fontWeight="bold">
              השפעת ריכוזי מלח על קצב פעילות קטלאז בשני זנים של יבלית
            </text>
            
            {/* מקרא מסודר - טקסט בצד ימין, סמלים בצד שמאל */}
            <g transform="translate(540, 20)">
              <rect x="0" y="0" width="90" height="65" fill="white" stroke="#ccc" rx="4"/>
              
              <text x="80" y="22" fontSize="13" fontWeight="bold" textAnchor="end" fill="#333">מקרא:</text>
              
              <text x="80" y="42" fontSize="13" fill="#333" textAnchor="end">זן א'</text>
              <path d="M 10 38 L 35 38" stroke="#d97706" strokeWidth="2" strokeDasharray="5,5" />
              <circle cx="22.5" cy="38" r="4" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
              
              <text x="80" y="58" fontSize="13" fill="#333" textAnchor="end">זן ב'</text>
              <path d="M 10 54 L 35 54" stroke="#78350f" strokeWidth="2" />
              <circle cx="22.5" cy="54" r="4" fill="#78350f" />
            </g>

            <g stroke="#e5e7eb" strokeWidth="1">
              {[...Array(11)].map((_, i) => <line key={i} x1="80" y1={250 - i*20} x2="480" y2={250 - i*20} strokeDasharray={i > 0 ? "2,2" : ""} />)}
              {[...Array(11)].map((_, i) => <line key={i} x1={80 + i*40} y1="50" x2={80 + i*40} y2="250" strokeDasharray="2,2" />)}
            </g>
            <polyline points="80,50 80,250 480,250" fill="none" stroke="#374151" strokeWidth="2" />
            
            <path d="M 80 150 Q 140 150 200 150 Q 240 150 280 90 Q 320 30 360 130 Q 420 160 480 190" fill="none" stroke="#78350f" strokeWidth="3" />
            <path d="M 80 150 Q 140 150 200 150 Q 240 150 280 150 Q 320 150 360 68 Q 420 70 480 78" fill="none" stroke="#d97706" strokeWidth="3" strokeDasharray="6,6" />
            
            {/* נקודות זן ב' */}
            <circle cx="80" cy="150" r="4" fill="#78350f" />
            <circle cx="200" cy="150" r="4" fill="#78350f" />
            <circle cx="280" cy="90" r="4" fill="#78350f" />
            <circle cx="360" cy="130" r="4" fill="#78350f" />
            <circle cx="480" cy="190" r="4" fill="#78350f" />

            {/* נקודות זן א' */}
            <circle cx="80" cy="150" r="4" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
            <circle cx="280" cy="150" r="4" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
            <circle cx="360" cy="68" r="4" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
            <circle cx="480" cy="78" r="4" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
            
            {/* מספרי ציר Y */}
            <g fontSize="12" fill="#57534e" textAnchor="end">
              {[...Array(11)].map((_, i) => (
                <text key={`ty${i}`} x="70" y={250 - i*20 + 4}>{i*5}</text>
              ))}
            </g>

            {/* מספרי ציר X */}
            <g fontSize="12" fill="#57534e" textAnchor="middle">
              {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map((v, i) => (
                <text key={`tx${i}`} x={80 + i*40} y="268">{v}</text>
              ))}
            </g>

            {/* כותרת ציר X */}
            <text x="280" y="310" fontSize="14" fill="#1c1917" textAnchor="middle" fontWeight="bold">
              ריכוז מלח NaCl בתמיסת הגידול (%)
            </text>

            {/* כותרת ציר Y */}
            <text transform="translate(30, 150) rotate(-90)" fill="#1c1917" textAnchor="middle" fontWeight="bold" fontSize="14">
              <tspan x="0" y="0">קצב פעילות האנזים קטלאז</tspan>
              <tspan x="0" y="20">(יחידות יחסיות)</tspan>
            </text>
          </svg>
        </div>
      </div>

      <MultipleChoiceQnA qNum="11. א" question="על סמך הנתונים, איזה זן יבלית מותאם לגידול בתנאי מליחות גבוהים (0.7% ומעלה)?" options={["אף אחד מהזנים.", "שני הזנים באופן זהה.", "זן ב' מותאם, זן א' לא.", "זן א' מותאם, זן ב' לא."]} correctAnswerIndex={3} explanation="זן א' מצליח לשמור על פעילות אנזימטית גבוהה יחסית גם בריכוזי מלח גבוהים." />
      
      <MultipleChoiceQnA 
        qNum="11. ב" 
        question="איזה נימוק מסביר בצורה הטובה ביותר את הקביעה שלכם?" 
        options={[
          "בניסוי 1 זן א' הראה עלייה במי חמצן, מה שמעיד על התאמה.",
          "בזן א' רמת מי החמצן נשמרת נמוכה (ניסוי 1), ופעילות הקטלאז נשארת גבוהה (ניסוי 2).",
          "בזן ב' פעילות הקטלאז עולה ב-0.7%, מה שמגן עליו.",
          "אין קשר בין ניסוי 1 לניסוי 2."
        ]}
        correctAnswerIndex={1}
        explanation={`לזן א' (המותאם): לפי ניסוי 1, רמת מי החמצן (שהם רעילים) נשמרת נמוכה בכל ריכוזי המלח. לפי ניסוי 2, פעילות האנזים קטלאז נשארת גבוהה גם בריכוזי מלח גבוהים. לזן ב' (שאינו מותאם): לפי ניסוי 1, בריכוזים הגבוהים חלה עלייה ברמת מי החמצן. לפי ניסוי 2, רואים ירידה תלולה בפעילות האנזים קטלאז ככל שעולה ריכוז המלח.`} 
      />

      <MultipleChoiceQnA 
        qNum="12. א" 
        question="היעזרו בתשובתכם על שאלה 7, מהי הסיבה להבדל בין תוצאות הניסוי שערכתם בחלק ב ובין התוצאות שהתקבלו בנוגע לזן המותאם בניסוי 2 של החוקרים?" 
        options={[
          "בעדשים המלח חדר ופגע באנזים, בעוד שביבלית זן א' ייתכן שיש מנגנון המונע כניסת מלח לתא או שהאנזים עמיד.",
          "צמחי עדשים מבצעים פוטוסינתזה חזקה יותר המעכבת את הפירוק, בעוד שביבלית הפוטוסינתזה חלשה יחסית.",
          "בעדשים האנזים קטלאז מזרז בניית מי חמצן במקום פירוקם, מה שמוביל להרעלה מהירה בתנאי מליחות קיצוניים.",
          "ביבלית מזן א' האנזים קטלאז אינו קיים כלל באופן טבעי, ולכן התגובה לא יכלה להיפגע מנוכחות של יוני מלח."
        ]}
        correctAnswerIndex={0}
        explanation={`הסיבה להבדל: בעדשים יוני הנתרן (מהמלח) חדרו וגרמו לדנטורציה (שינוי מבנה מרחבי) בחלבונים/אנזים ולירידה בפעילותו. לעומת זאת, ביבלית מזן א' (המותאם), ייתכן שיש מנגנון המונע כניסת מלח לתא, או שהחלבון/האנזים שלו עמיד למליחות ומבנהו המרחבי אינו נפגע.`} 
      />

      <MultipleChoiceQnA 
        qNum="12. ב" 
        question="איזו השפעה נוספת של מלח המצוי בקרקע יש על צמחים, מלבד מה שרשום בלידיעתכם 1?" 
        options={[
          "המלח מעלה בצורה משמעותית את טמפרטורת הקרקע במהלך שעות היום, מה שגורם לשריפת השורשים ולהפסקת הצמיחה.",
          "ריכוז מלחים גבוה יוצר סביבה היפרטונית המורידה את פוטנציאל המים בקרקע, ומקשה על הצמח לקלוט מים לתוכו.",
          "נוכחות של מלח בריכוז גבוה מזרזת את קצב הפריחה של הצמח, ולכן הוא מסיים את מחזור חייו מהר ומתייבש.",
          "המלח המצטבר בקרקע מונע באופן ישיר כניסת פחמן דו-חמצני דרך הפיוניות, ובכך עוצר לגמרי את הפוטוסינתזה."
        ]}
        correctAnswerIndex={1}
        explanation={`השפעה אוסמוטית. ריכוז מלחים גבוה בקרקע גורם לירידת פוטנציאל המים (או יצירת סביבה היפרטונית בקרקע ביחס לצמח). כתוצאה מכך, קשה לצמח לקלוט מים מן הקרקע (או אפילו מים עלולים לצאת מהצמח לקרקע), והצמח נמצא בסכנת התייבשות / קמילה / פגיעה בטורגור.`} 
      />
    </div>
  );
};

// --- Main Application ---
const App = () => {
  return (
    <div className="rtl min-h-screen bg-orange-50/20 text-stone-900 font-sans p-2 md:p-6">
      <style>{customStyles}</style>
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-100">
        <header className="bg-gradient-to-l from-stone-800 via-amber-800 to-orange-700 text-white p-6 md:p-8 text-center shadow-lg">
          <h1 className="text-xl md:text-3xl font-black mb-2 tracking-tight" style={{ fontFamily: "'Rubik', sans-serif" }}>מעבדה בביולוגיה: פעילות אנזים קטלאז</h1>
          <div className="text-xs md:text-sm bg-white/10 inline-block px-4 py-1 rounded-full backdrop-blur-md border border-white/20 font-medium">בגרות 2022 בעיה 1</div>
        </header>

        <main className="p-4 md:p-8">
          <PartA />
          <PartB />
          <PartC />
        </main>

        <footer className="bg-gradient-to-l from-stone-800 via-amber-800 to-orange-700 text-white/90 p-4 text-center text-xs md:text-sm shadow-inner">
          כל הזכויות לתוכן הבחינה שמורות למשרד החינוך | נערך על ידי רבקה פרידלנד כהן
        </footer>
      </div>
    </div>
  );
};

export default App;
