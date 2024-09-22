/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  MessageSquare,
  MoreVertical,
  Plus,
  Copy,
  ArrowUpRight,
  AlignHorizontalSpaceAround,
  ArrowDown,
} from "lucide-react";
import avatar from "./../assets/images (1).jpeg";

const PersonalCard = ({ details }) => {
  const { name, balance, cards, availableBalance, cardNumber } = details;
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [color, setColor] = useState(() =>
    cards[activeCardIndex].color.split("-").at(1)
  );
  const [buttonText, setButtonText] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [_, setIsDragging] = useState(false);
  const dragRef = useRef(null);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  const formatCardNumber = (inputString) => {
    const parts = inputString.split(" ");
    parts[1] = "****";
    parts[2] = "****";
    return parts.join(" ");
  };

  const handleCardChange = (newIndex) => {
    if (newIndex < 0 || newIndex >= cards.length) return;
    setDirection(newIndex > activeCardIndex ? 1 : -1);
    setActiveCardIndex(newIndex);
    setColor(cards[newIndex].color.split("-").at(1));
  };

  const handleDragEnd = (event, info) => {
    const threshold = 100;
    if (info.offset.x < -threshold) {
      handleCardChange(activeCardIndex + 1);
    } else if (info.offset.x > threshold) {
      handleCardChange(activeCardIndex - 1);
    }
    setIsDragging(false);
  };

  const handleCopy = (number) => {
    navigator.clipboard
      .writeText(number)
      .then(() => {
        setButtonText("Copied!");
        setTimeout(() => setButtonText(""), 3000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-80 bg-white flex flex-col gap-5 rounded-3xl p-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <img
              src={avatar}
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="text-sm text-gray-500">Welcome</p>
              <p className="font-semibold">{name},</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="hover mr-2">
              <Bell size={20} className="text-gray-600" />
            </button>
            <button className="hover">
              <MessageSquare size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="relative h-36 overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              ref={dragRef}
              key={activeCardIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 400, damping: 40 },
                opacity: { duration: 0.1 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
              className="absolute w-full h-full cursor-grab"
            >
              <div
                className={`flex w-full h-full justify-between items-stretch text-white rounded-2xl overflow-hidden`}
              >
                <div
                  className={`${cards[activeCardIndex].color} p-4 w-full rounded-l-2xl rounded-br-2xl flex flex-col justify-between`}
                >
                  <div>
                    <p className="text-sm opacity-80">Personal Card</p>
                    <p className="text-3xl font-bold mt-2">
                      {balance.slice(0, -2)}{" "}
                      <span className="text-xl font-medium opacity-60">
                        {balance.slice(-2)}
                      </span>
                    </p>
                    <p className="text-xs mt-[1px]">
                      Available Balance: {availableBalance}
                    </p>
                  </div>
                  <p className="flex items-center font-medium gap-4 text-xs mt-3">
                    {formatCardNumber(cardNumber)}
                    {buttonText ? (
                      <span className="text-gray-50 font-extrabold">
                        {buttonText}
                      </span>
                    ) : (
                      <button onClick={() => handleCopy(cardNumber)}>
                        <Copy size={16} className="ml-1" />
                      </button>
                    )}
                  </p>
                </div>

                <div>
                  <div
                    className={`${cards[activeCardIndex].color} h-[75%] rounded-br-2xl flex flex-col justify-between items-end py-2 px-1`}
                  >
                    <button>
                      <MoreVertical size={20} />
                    </button>
                    <div className="h-2 w-2"></div>
                  </div>
                  <div
                    className={`${cards[activeCardIndex].color} h-[25%] w-9 rounded-r-full rounded-bl-full`}
                  >
                    <div className="rounded-full h-full w-full flex justify-center items-center bg-white">
                      <button>
                        <Plus
                          size={24}
                          color={color}
                          className={`${cards[activeCardIndex].color.replace(
                            "bg-",
                            "text-"
                          )} bg-white hover:scale-125 rounded-full`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center items-center mt-4">
          {cards.map((_, index) => (
            <button
              key={index}
              className={`rounded-full mx-1 ${
                index === activeCardIndex
                  ? "bg-gray-800 w-2 h-2"
                  : "bg-gray-300 w-[6px] h-[6px]"
              }`}
              onClick={() => handleCardChange(index)}
            />
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <button className="button">
            <Plus size={16} />
            <span>Add</span>
          </button>
          <button className="button">
            <ArrowUpRight size={16} />
            <span>Send</span>
          </button>
          <button className="button">
            <ArrowDown size={16} />
            Request
          </button>
          <button className="button">
            <AlignHorizontalSpaceAround
              size={22}
              color={color}
              className="font-semibold"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalCard;
