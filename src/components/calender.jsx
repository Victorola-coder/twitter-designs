import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 8, 1)); // September 2024
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [direction, setDirection] = useState(0);
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  useEffect(() => {
    generateCalendarDays(currentDate);
  }, [currentDate]);

  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    let days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({
        date: new Date(year, month, -firstDay + i + 1),
        currentMonth: false,
      });
    }
    for (let i = 1; i <= lastDate; i++) {
      days.push({ date: new Date(year, month, i), currentMonth: true });
    }
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        days.push({ date: new Date(year, month + 1, i), currentMonth: false });
      }
    }
    setDaysInMonth(days);
  };

  const navigateMonth = (newDirection) => {
    setDirection(newDirection);
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + newDirection);
      return newDate;
    });
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.y < -50) {
      navigateMonth(1);
    } else if (info.offset.y > 50) {
      navigateMonth(-1);
    }
  };

  const getDateContent = (date) => {
    const day = date.getDate();
    switch (day) {
      case 4:
        return <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1" />;
      case 10:
        return (
          <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1" />
        );
      case 14:
        return (
          <div className="w-2 h-2 bg-purple-500 rounded-full mx-auto mt-1" />
        );
      case 16:
        return <div className="w-2 h-2 bg-red-500 rounded-full mx-auto mt-1" />;
      case 20:
        return <span className="text-xs">✕</span>;
      case 25:
        return (
          <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1" />
        );
      default:
        return null;
    }
  };

  const formatMonth = (date) => {
    return date.toLocaleString("default", { month: "long" });
  };

  const variants = {
    enter: (direction) => ({ y: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit: (direction) => ({ y: direction < 0 ? 50 : -50, opacity: 0 }),
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="w-[300px] bg-[#1C1C1E] rounded-3xl p-4 text-white font-sans">
        <div className="">
          <div className="flex flex-row justify-between items-center mb-4">
            <h2 className="flex flex-row items-center gap-1 text-xl font-semibold">
              {formatMonth(currentDate)}
              <span className="text-gray-500">{currentDate.getFullYear()}</span>
            </h2>
            <p className="text-xs text-gray-400">$77.15</p>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {days.map((day) => (
            <div key={day} className="text-center text-[10px] text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentDate.toISOString()}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={handleDragEnd}
              transition={{ type: "tween", duration: 0.3 }}
              className="grid grid-cols-7 gap-1"
            >
              {daysInMonth.map((dayObj, index) => (
                <div
                  key={index}
                  className={`
                    flex flex-col items-center justify-center w-10 h-10 rounded-lg text-sm
                    ${dayObj.currentMonth ? "" : "text-gray-600"}
                    ${
                      dayObj.date.getDate() === 4 && dayObj.currentMonth
                        ? "bg-white/10"
                        : ""
                    }
                  `}
                >
                  {dayObj.date.getDate()}
                  {dayObj.currentMonth && getDateContent(dayObj.date)}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
