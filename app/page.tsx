"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronRight, ChevronLeft, Volume2 } from "lucide-react";
// Put this outside your component or near the top
const BACKGROUND_TRACKS = [
  { name: "Animals", url: "/audio/animals.mp3" },
  { name: "Enjoy", url: "/audio/enjoy.mp3" }, // Replace with your public domain hymn URLs
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
  const [currentTrackIndex, setCurrentTrackIndex] = useState(1);
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
      }
    };

    playMusic();
  }, [showStory]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.src = BACKGROUND_TRACKS[currentTrackIndex].url;

    if (isMusicPlaying) {
      audioRef.current.play().catch((err) => {
        console.error("Audio playback failed:", err);
      });
    }
  }, [currentTrackIndex, isMusicPlaying]);
  const toggleMusic = async () => {
    if (!audioRef.current) return;

    try {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        await audioRef.current.play();
        setIsMusicPlaying(true);
      }
    } catch (err) {
      console.error("Audio playback failed:", err);
    }
  };

  const stopAllMedia = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsMusicPlaying(false);
  };

  const storyOptions = Object.entries(STORIES).map(([key, story]) => ({
    key,
    title: story.title,
    lesson: story.lesson,
  }));

  const currentStoryData = selectedStory ? STORIES[selectedStory] : null;
  const currentSlideData = currentStoryData
    ? currentStoryData.slides[currentSlide]
    : null;

  const handleListen = () => {
    if (!currentSlideData) return;

    // Always stop previous speech first
    window.speechSynthesis.cancel();

    setIsSpeaking(false);

    const text = currentSlideData.text.replace("[CHILD_NAME]", childName);

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = 0.78;
    utterance.pitch = 1.15;
    utterance.volume = 1;

    const preferredVoice =
      voices.find((v) => v.name === "Google UK English Female") ||
      voices.find((v) => v.name === "Microsoft Zira") ||
      voices.find((v) => v.name === "Microsoft Aria") ||
      voices.find((v) => v.name === "Samantha") ||
      voices.find((v) => v.name === "Karen") ||
      voices.find((v) => v.name === "Moira") ||
      voices.find((v) => v.name.toLowerCase().includes("female"));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    setIsSpeaking(true);

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(utterance);
  };

  const formattedText = currentSlideData
    ? currentSlideData.text.replace("[CHILD_NAME]", childName)
    : "";

  const storySlideContent = (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-yellow-100 p-8">
        {/* Picture book style frame */}
        <div className="mb-6">
          <CartoonScene
            type={currentSlideData?.cartoon ?? ""}
            childName={childName}
          />
        </div>

        {/* Story text */}
        <p className="text-center text-xl text-gray-800 mb-8 leading-relaxed font-semibold">
          {formattedText}
        </p>

        {/* Story progress */}
        <div className="flex justify-center gap-2 mb-8">
          {/* FIX 1: Added optional chaining here */}
          {currentStoryData?.slides?.map((_, idx) => (
            <div
              key={idx}
              className={`h-3 rounded-full transition-all ${
                idx === currentSlide ? "w-8 bg-pink-500" : "w-3 bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Background Music Controller */}
        <div className="flex justify-center items-center gap-4 mb-6 p-3 bg-purple-50 rounded-2xl border-2 border-purple-100">
          <button
            onClick={toggleMusic}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${
              isMusicPlaying
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            🎵 {isMusicPlaying ? "Music: ON" : "Music: OFF"}
          </button>

          <select
            value={currentTrackIndex}
            onChange={(e) => setCurrentTrackIndex(Number(e.target.value))}
            className="px-3 py-2 text-sm rounded-xl border-2 border-purple-200 bg-white font-semibold text-gray-700 focus:outline-none"
          >
            {BACKGROUND_TRACKS.map((track, i) => (
              <option key={i} value={i}>
                {track.name}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center gap-4 mb-6">
          <button
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 transition-colors font-bold text-lg"
          >
            <ChevronLeft size={24} />
            Back
          </button>

          <button
            onClick={handleListen}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors font-bold text-lg animate-pulse"
          >
            <Volume2 size={24} />
            {isSpeaking ? "Reading Story..." : "Read Again"}
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
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 transition-colors font-bold text-lg"
          >
            Next
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Back to menu button */}
        <button
          onClick={() => {
            stopAllMedia();
            setShowStory(false);
            setCurrentSlide(0);
          }}
          className="w-full mt-8 px-6 py-4 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors font-bold text-lg"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );

  const configForm = (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-b from-purple-100 to-pink-100 rounded-3xl shadow-2xl p-8 md:p-12 border-8 border-pink-200">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-2 text-purple-800">
          🙏 My Bible Adventure
        </h1>
        <p className="text-center text-lg text-purple-700 mb-8">
          Let's create your story!
        </p>

        <div className="space-y-6">
          {/* Child's Name */}
          <div>
            <label className="block text-xl font-bold text-gray-800 mb-2">
              👤 Child's Name
            </label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Enter name"
              className="w-full px-6 py-4 text-lg rounded-xl border-4 border-purple-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-600 font-semibold"
            />
          </div>

          {/* Pronouns */}
          <div>
            <label className="block text-xl font-bold text-gray-800 mb-3">
              💬 Pronoun
            </label>
            <div className="flex gap-6">
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
                  <span className="text-lg font-semibold text-gray-800">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Story Selection */}
          <div>
            <label className="block text-xl font-bold text-gray-800 mb-2">
              📖 Bible Adventure
            </label>
            <select
              value={selectedStory}
              onChange={(e) => setSelectedStory(e.target.value as keyof typeof STORIES | "")}
              className="w-full px-6 py-4 text-lg rounded-xl border-4 border-purple-300 bg-white text-gray-800 focus:outline-none focus:border-purple-600 font-semibold"
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
            className="w-full px-8 py-5 mt-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl font-bold rounded-2xl hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed transition-all hover:scale-105"
          >
            📖 Open My Bible Story
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 ${
        showStory
          ? "bg-gradient-to-b from-blue-50 to-purple-100"
          : "bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50"
      } py-8 px-4`}
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
        <div className="text-center mb-12">
          <div className="text-7xl mb-4 animate-float">✨</div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 mb-2">
            My Bible Adventure
          </h1>
          <p className="text-lg text-gray-700">
            For Christian Families & Sunday Schools
          </p>
        </div>

        {/* Main Content */}
        <div className="animate-slide-in">
          {showStory ? storySlideContent : configForm}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p className="text-sm">
            Made with ❤️ for families exploring God's Word together
          </p>
        </div>
      </div>
    </div>
  );
}
