"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronRight, ChevronLeft, Volume2 } from "lucide-react";

// Put this outside your component or near the top
const BACKGROUND_TRACKS = [
  { name: "Animals", url: "/audio/animals.mp3" },
  { name: "Enjoy", url: "/audio/enjoy.mp3" },
  { name: "Kitty", url: "/audio/kitty.mp3" },
  { name: "Storybook", url: "/audio/storybook.mp3" },
];

// Story data with exactly 5 slides per story
const STORIES = {
  "noahs-ark": {
    title: "Noah's Ark",
    lesson: "Obedience & Trust",
    slides: [
      {
        text: "One day, God asked Noah to build a big, big boat called an ark. Noah listened and said yes, even though it seemed strange!",
        cartoon: "ark-1",
      },
      {
        text: "Noah worked very hard, sawing wood and building the boat. [CHILD_NAME] helped paint the boat with bright colors!",
        cartoon: "ark-2",
      },
      {
        text: "Two of every animal came to the ark—lions, sheep, birds, and more! They marched in happily, ready for an adventure.",
        cartoon: "ark-3",
      },
      {
        text: "Rain fell and fell, but Noah and [CHILD_NAME] stayed safe and dry inside the big boat with all the animals.",
        cartoon: "ark-4",
      },
      {
        text: "When the rain stopped, a beautiful rainbow appeared! God kept Noah and [CHILD_NAME] safe because they were obedient and faithful.",
        cartoon: "ark-5",
      },
    ],
  },
  "david-goliath": {
    title: "David & Goliath",
    lesson: "Courage & Faith",
    slides: [
      {
        text: "A giant named Goliath was very mean and scary. Everyone was afraid, but little David had big faith in God!",
        cartoon: "dg-1",
      },
      {
        text: "[CHILD_NAME] cheered for David as he picked up five smooth stones and his sling. 'I am not alone,' David said bravely.",
        cartoon: "dg-2",
      },
      {
        text: "David spun his sling around and around, faster and faster. The stone flew through the air toward the giant!",
        cartoon: "dg-3",
      },
      {
        text: "With one brave shot, David won the battle! Goliath fell down, and all the people cheered for brave little David!",
        cartoon: "dg-4",
      },
      {
        text: "[CHILD_NAME] learned that with God's help, you can do amazing things, even when you're small or scared.",
        cartoon: "dg-5",
      },
    ],
  },
  "daniel-lions": {
    title: "Daniel & the Lions",
    lesson: "Prayer & Protection",
    slides: [
      {
        text: "Daniel was a kind man who loved God so much. He prayed three times every day, and [CHILD_NAME] loved his faithful heart!",
        cartoon: "dl-1",
      },
      {
        text: "A mean king made a rule that nobody could pray. But Daniel kept praying because he loved God most of all.",
        cartoon: "dl-2",
      },
      {
        text: "Guards caught Daniel and put him in a pit with big, hungry lions! [CHILD_NAME]'s heart beat fast. Would Daniel be okay?",
        cartoon: "dl-3",
      },
      {
        text: "But Daniel prayed, and God sent angels to keep the lions calm and gentle. They didn't hurt Daniel at all!",
        cartoon: "dl-4",
      },
      {
        text: "The king let Daniel out, so happy and safe! [CHILD_NAME] learned that God protects those who love and trust Him.",
        cartoon: "dl-5",
      },
    ],
  },
  "esther-courage": {
    title: "Queen Esther's Courage",
    lesson: "Bravery for Others",
    slides: [
      {
        text: "Esther was a beautiful, brave queen who loved her people. [CHILD_NAME] admired how she cared about everyone!",
        cartoon: "ec-1",
      },
      {
        text: "A mean man wanted to hurt Esther's people. Esther was scared, but she knew she had to be brave and ask the king for help.",
        cartoon: "ec-2",
      },
      {
        text: "Esther put on her prettiest dress and took a deep breath. She walked into the king's room, even though she was nervous!",
        cartoon: "ec-3",
      },
      {
        text: "The king was so happy to see Queen Esther! She bravely told him about the mean man's bad plan.",
        cartoon: "ec-4",
      },
      {
        text: "The king saved Esther's people! [CHILD_NAME] learned that being brave for others is the best kind of courage.",
        cartoon: "ec-5",
      },
    ],
  },
};

interface CartoonSceneProps {
  type: string;
  childName: string;
}

// Renders the static cartoonized webp images from your /public/images folder
const CartoonScene = ({ type, childName }: CartoonSceneProps) => {
  if (!type) {
    return (
      <div className="w-full aspect-[4/3] bg-purple-100 rounded-2xl flex items-center justify-center border-4 border-dashed border-purple-300">
        <span className="text-purple-400 text-lg font-semibold animate-pulse">
          Loading illustration...
        </span>
      </div>
    );
  }

  // Points to your images directory using the webp file extension
  const imagePath = type ? `/images/${type}.png` : "/images/placeholder.png";

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md border-4 border-yellow-200 bg-blue-50">
      <img
        src={imagePath}
        alt={`${childName}'s Bible Adventure Scene`}
        className="w-full h-full object-cover object-center"
        loading="lazy"
        draggable={false}
        onError={(e) => {
          e.currentTarget.src = "/images/placeholder.png";
        }}
      />
    </div>
  );
};

// Main application component
export default function MyBibleAdventure() {
  const [childName, setChildName] = useState("");
  const [childPronoun, setChildPronoun] = useState("he");
  const [selectedStory, setSelectedStory] = useState<keyof typeof STORIES | "">(
    "",
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showStory, setShowStory] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(2);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();

      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    loadVoices();

    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (!showStory || !currentSlideData) return;

    // Stop previous narration immediately
    window.speechSynthesis.cancel();

    // Small delay allows UI render before speaking
    const timeout = setTimeout(() => {
      handleListen();
    }, 500);

    return () => {
      clearTimeout(timeout);
      window.speechSynthesis.cancel();
    };
  }, [currentSlide, showStory]);

  useEffect(() => {
    audioRef.current = new Audio("/audio/storybook.mp3");

    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.25;
    }

    return () => {
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (!showStory || !audioRef.current) return;

    const playMusic = async () => {
      try {
        audioRef.current!.src = BACKGROUND_TRACKS[currentTrackIndex].url;

        audioRef.current!.volume = 0.25;
        audioRef.current!.loop = true;

        await audioRef.current!.play();

        setIsMusicPlaying(true);
      } catch (err) {
        console.error("Autoplay blocked:", err);
        setIsMusicPlaying(false);
      }
    };

    playMusic();
  }, [showStory, currentTrackIndex]);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current.play();
      setIsMusicPlaying(true);
    }
  };

  const stopAllMedia = () => {
    window.speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
    setIsMusicPlaying(false);
  };

  const storyOptions = Object.entries(STORIES).map(([key, story]) => ({
    key,
    title: story.title,
    lesson: story.lesson,
  }));

  const currentStoryData = selectedStory ? STORIES[selectedStory] : null;
  const currentSlideData = currentStoryData ? currentStoryData.slides[currentSlide] : null;

  const handleListen = () => {
    if (!currentSlideData) return;

    const text = currentSlideData.text.replace("[CHILD_NAME]", childName);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.82;
    utterance.pitch = 1;
    utterance.volume = 1;

    const preferredVoice = voices.find((v) =>
      v.name.includes("Google UK English Female") ||
      v.name.includes("Samantha") ||
      v.name.includes("Victoria")
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const formattedText = currentSlideData
    ? currentSlideData.text.replace("[CHILD_NAME]", childName)
    : "";

  const storySlideContent = (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-yellow-100 p-4 sm:p-6 md:p-8">
        {/* Picture book style frame */}
        <div className="mb-4 sm:mb-6">
          <CartoonScene 
		  type={currentSlideData?.cartoon ?? "default"} 
		  childName={childName} 
		/>

        </div>

        {/* Story text */}
        <p className="text-center text-base sm:text-lg md:text-xl text-gray-800 mb-4 sm:mb-6 leading-relaxed font-semibold">
          {formattedText}
        </p>

        {/* Story progress */}
        <div className="flex justify-center gap-2 mb-4 sm:mb-6 flex-wrap">
          {currentStoryData?.slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-3 rounded-full transition-all ${
                idx === currentSlide ? "w-8 bg-pink-500" : "w-3 bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Navigation buttons - MOBILE OPTIMIZED */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <button
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="flex items-center justify-center gap-2 flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 transition-colors font-bold text-sm sm:text-base md:text-lg whitespace-nowrap"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
            <span>Back</span>
          </button>

          <button
            onClick={handleListen}
            className="flex items-center justify-center gap-2 flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors font-bold text-sm sm:text-base md:text-lg animate-pulse whitespace-nowrap"
          >
            <Volume2 size={20} className="sm:w-6 sm:h-6" />
            <span>{isSpeaking ? "Reading..." : "Read"}</span>
          </button>

          <button
            onClick={() =>
              setCurrentSlide(
                Math.min(
                  (currentStoryData?.slides?.length ?? 1) - 1,
                  currentSlide + 1,
                ),
              )
            }
            disabled={
              currentSlide === (currentStoryData?.slides?.length ?? 1) - 1
            }
            className="flex items-center justify-center gap-2 flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 transition-colors font-bold text-sm sm:text-base md:text-lg whitespace-nowrap"
          >
            <span>Next</span>
            <ChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Background Music Controller - MOBILE OPTIMIZED */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-4 sm:mb-6 p-3 bg-purple-50 rounded-2xl border-2 border-purple-100">
          <button
            onClick={toggleMusic}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
              isMusicPlaying
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            🎵 {isMusicPlaying ? "ON" : "OFF"}
          </button>

          <select
            value={currentTrackIndex}
            onChange={(e) => setCurrentTrackIndex(Number(e.target.value))}
            className="px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-xl border-2 border-purple-200 bg-white font-semibold text-gray-700 focus:outline-none flex-1 sm:flex-none min-w-max"
          >
            {BACKGROUND_TRACKS.map((track, i) => (
              <option key={i} value={i}>
                {track.name}
              </option>
            ))}
          </select>
        </div>

        {/* Back to menu button */}
        <button
          onClick={() => {
            stopAllMedia();
            setShowStory(false);
            setCurrentSlide(0);
          }}
          className="w-full px-4 sm:px-6 py-4 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors font-bold text-base sm:text-lg"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );

  const configForm = (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="bg-gradient-to-b from-purple-100 to-pink-100 rounded-3xl shadow-2xl p-4 sm:p-8 md:p-12 border-8 border-pink-200">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-2 text-purple-800">
          🙏 My Bible Adventure
        </h1>
        <p className="text-center text-base sm:text-lg text-purple-700 mb-6 sm:mb-8">
          Let's create your story!
        </p>

        <div className="space-y-4 sm:space-y-6">
          {/* Child's Name */}
          <div>
            <label className="block text-base sm:text-xl font-bold text-gray-800 mb-2">
              👤 Child's Name
            </label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Enter name"
              className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg rounded-xl border-4 border-purple-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-600 font-semibold"
            />
          </div>

          {/* Pronouns */}
          <div>
            <label className="block text-base sm:text-xl font-bold text-gray-800 mb-3">
              💬 Pronoun
            </label>
            <div className="flex gap-4 sm:gap-6 flex-wrap">
              {[
                { value: "he", label: "He / Him" },
                { value: "she", label: "She / Her" },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    value={option.value}
                    checked={childPronoun === option.value}
                    onChange={(e) => setChildPronoun(e.target.value)}
                    className="w-6 h-6 cursor-pointer"
                  />
                  <span className="text-base sm:text-lg font-semibold text-gray-800">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Story Selection */}
          <div>
            <label className="block text-base sm:text-xl font-bold text-gray-800 mb-2">
              📖 Bible Adventure
            </label>
            <select
              value={selectedStory}
              onChange={(e) => setSelectedStory(e.target.value as keyof typeof STORIES | "")}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg rounded-xl border-4 border-purple-300 bg-white text-gray-800 focus:outline-none focus:border-purple-600 font-semibold"
            >
              <option value="">-- Choose a story --</option>
              {storyOptions.map((story) => (
                <option key={story.key} value={story.key}>
                  {story.title} ({story.lesson})
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            onClick={() => {
              if (childName.trim() && selectedStory) {
                setShowStory(true);
                setCurrentSlide(0);
              }
            }}
            disabled={!childName.trim() || !selectedStory}
            className="w-full px-4 sm:px-8 py-4 sm:py-5 mt-4 sm:mt-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg sm:text-2xl font-bold rounded-2xl hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed transition-all hover:scale-105"
          >
            📖 Open My Bible Story
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <main
      className={`min-h-screen w-full transition-colors duration-500 ${
        showStory
          ? "bg-gradient-to-b from-blue-50 to-purple-100"
          : "bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50"
      } py-4 sm:py-8 px-4 sm:px-6`}
      style={{
        overflowX: "hidden",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-slide-in {
          animation: slide-in 0.6s ease-out;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="text-5xl sm:text-7xl mb-2 sm:mb-4 animate-float">✨</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 mb-2">
            My Bible Adventure
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-700">
            For Christian Families & Sunday Schools
          </p>
        </div>

        {/* Main Content */}
        <div className="animate-slide-in">
          {showStory ? storySlideContent : configForm}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 sm:mt-12 text-gray-600">
          <p className="text-xs sm:text-sm">
            Made with ❤️ for families exploring God's Word together
          </p>
        </div>
      </div>
    </main>
  );
}
