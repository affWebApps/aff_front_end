import { motion } from "framer-motion";

interface AnalyticsViewProps {
  onNavigate: (view: "users" | "projects") => void;
}

const AnalyticsView = ({ onNavigate }: AnalyticsViewProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const statsCards = [
    {
      title: "Total Users",
      value: "2,341",
      change: "+156 this week",
      positive: true,
    },
    {
      title: "Total Designers",
      value: "2,341",
      change: "+12% from last month",
      positive: true,
    },
    {
      title: "Total Tailors",
      value: "156",
      change: "+3 new this week",
      positive: true,
    },
    {
      title: "Total Revenue",
      value: "₦580,000",
      change: "+23% from last month",
      positive: true,
    },
  ];

  const additionalStats = [
    {
      title: "Active Projects",
      value: "482",
      change: "-1.8% vs last month",
      positive: false,
    },
    {
      title: "Completed Projects",
      value: "1,847",
      change: "-12% vs Q1",
      positive: false,
    },
    {
      title: "Avg. Rating",
      value: "4.8/5",
      change: "+0.3 from last month",
      positive: true,
    },
    {
      title: "Platform Uptime",
      value: "99.8%",
      change: "No incidents this month",
      positive: true,
    },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.h2
        variants={itemVariants}
        className="text-xl font-medium text-gray-900 mb-1 font-(family-name:--font-montserrat)"
      >
        Analytics
      </motion.h2>
      <motion.p variants={itemVariants} className="text-gray-600 text-sm mb-8">
        Real-time insights into your AFF platform
      </motion.p>
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {statsCards.map((card, index) => {
          const isClickable =
            card.title === "Total Users" ||
            card.title === "Total Designers" ||
            card.title === "Total Tailors";
          const Component = isClickable ? "button" : "div";

          return (
            <Component
              key={index}
              onClick={isClickable ? () => onNavigate("users") : undefined}
              className={`bg-white rounded-lg border border-gray-200  p-6 text-left ${
                isClickable
                  ? "cursor-pointer hover:shadow-lg transition-all"
                  : ""
              }`}
            >
              <p className="text-sm text-gray-600 mb-2 ">{card.title}</p>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {card.value}
              </h3>
              <p
                className={`text-sm ${
                  card.positive ? "text-green-600" : "text-red-600"
                }`}
              >
                {card.change}
              </p>
            </Component>
          );
        })}
      </motion.div>

      {/* Additional Stats */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {additionalStats.map((card, index) => {
          const isClickable =
            card.title === "Active Projects" ||
            card.title === "Completed Projects";
          const Component = isClickable ? "button" : "div";

          return (
            <Component
              key={index}
              onClick={isClickable ? () => onNavigate("projects") : undefined}
              className={`bg-white rounded-lg border border-gray-200 p-6 text-left ${
                isClickable
                  ? "cursor-pointer hover:shadow-lg transition-all"
                  : ""
              }`}
            >
              <p className="text-sm text-gray-600 mb-2">{card.title}</p>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {card.value}
              </h3>
              <p
                className={`text-sm ${
                  card.positive ? "text-green-600" : "text-red-600"
                }`}
              >
                {card.change}
              </p>
            </Component>
          );
        })}
      </motion.div>

      {/* Charts Section */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Growth Trend Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Growth Trend</h3>
          <p className="text-sm text-gray-600 mb-6">
            Designers and Tailors over time
          </p>

          <div className="relative h-64">
            <svg viewBox="0 0 500 200" className="w-full h-full">
              {/* Grid lines */}
              <line
                x1="50"
                y1="20"
                x2="480"
                y2="20"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <line
                x1="50"
                y1="60"
                x2="480"
                y2="60"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <line
                x1="50"
                y1="100"
                x2="480"
                y2="100"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <line
                x1="50"
                y1="140"
                x2="480"
                y2="140"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <line
                x1="50"
                y1="180"
                x2="480"
                y2="180"
                stroke="#e5e7eb"
                strokeWidth="1"
              />

              {/* Y-axis labels */}
              <text x="35" y="25" fontSize="10" fill="#6b7280">
                40
              </text>
              <text x="35" y="65" fontSize="10" fill="#6b7280">
                30
              </text>
              <text x="35" y="105" fontSize="10" fill="#6b7280">
                20
              </text>
              <text x="35" y="145" fontSize="10" fill="#6b7280">
                10
              </text>
              <text x="40" y="185" fontSize="10" fill="#6b7280">
                0
              </text>

              {/* Tailors line (blue) */}
              <polyline
                points="70,170 140,150 210,130 280,110 350,90 420,50"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              {/* Tailors points */}
              <circle cx="70" cy="170" r="4" fill="#3b82f6" />
              <circle cx="140" cy="150" r="4" fill="#3b82f6" />
              <circle cx="210" cy="130" r="4" fill="#3b82f6" />
              <circle cx="280" cy="110" r="4" fill="#3b82f6" />
              <circle cx="350" cy="90" r="4" fill="#3b82f6" />
              <circle cx="420" cy="50" r="4" fill="#3b82f6" />

              {/* Designers line (pink) */}
              <polyline
                points="70,155 140,140 210,95 280,120 350,165"
                fill="none"
                stroke="#ec4899"
                strokeWidth="2"
              />
              {/* Designers points */}
              <circle cx="70" cy="155" r="4" fill="#ec4899" />
              <circle cx="140" cy="140" r="4" fill="#ec4899" />
              <circle cx="210" cy="95" r="4" fill="#ec4899" />
              <circle cx="280" cy="120" r="4" fill="#ec4899" />
              <circle cx="350" cy="165" r="4" fill="#ec4899" />

              {/* X-axis labels */}
              <text x="60" y="195" fontSize="10" fill="#6b7280">
                January
              </text>
              <text x="125" y="195" fontSize="10" fill="#6b7280">
                February
              </text>
              <text x="205" y="195" fontSize="10" fill="#6b7280">
                March
              </text>
              <text x="270" y="195" fontSize="10" fill="#6b7280">
                April
              </text>
              <text x="345" y="195" fontSize="10" fill="#6b7280">
                May
              </text>
              <text x="410" y="195" fontSize="10" fill="#6b7280">
                June
              </text>
            </svg>
          </div>

          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ec4899]"></div>
              <span className="text-sm text-gray-600">Designers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
              <span className="text-sm text-gray-600">Tailors</span>
            </div>
          </div>
        </div>

        {/* Site Traffic Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Site Traffic</h3>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600">
              <option>This week</option>
              <option>Last week</option>
              <option>This month</option>
            </select>
          </div>

          <div className="relative h-64">
            <svg viewBox="0 0 500 220" className="w-full h-full">
              {/* Grid lines */}
              <line
                x1="50"
                y1="20"
                x2="480"
                y2="20"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <line
                x1="50"
                y1="70"
                x2="480"
                y2="70"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <line
                x1="50"
                y1="120"
                x2="480"
                y2="120"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <line
                x1="50"
                y1="170"
                x2="480"
                y2="170"
                stroke="#e5e7eb"
                strokeWidth="1"
              />

              {/* Y-axis labels */}
              <text x="25" y="25" fontSize="10" fill="#6b7280">
                100
              </text>
              <text x="30" y="75" fontSize="10" fill="#6b7280">
                80
              </text>
              <text x="30" y="125" fontSize="10" fill="#6b7280">
                60
              </text>
              <text x="30" y="175" fontSize="10" fill="#6b7280">
                40
              </text>

              {/* Bar chart */}
              {/* Monday */}
              <rect
                x="80"
                y="90"
                width="35"
                height="80"
                fill="#5C4033"
                rx="4"
              />
              {/* Tuesday */}
              <rect
                x="140"
                y="50"
                width="35"
                height="120"
                fill="#5C4033"
                rx="4"
              />
              {/* Wednesday */}
              <rect
                x="200"
                y="110"
                width="35"
                height="60"
                fill="#5C4033"
                rx="4"
              />
              {/* Thursday */}
              <rect
                x="260"
                y="40"
                width="35"
                height="130"
                fill="#5C4033"
                rx="4"
              />

              {/* X-axis labels */}
              <text x="85" y="190" fontSize="10" fill="#6b7280">
                Mon
              </text>
              <text x="145" y="190" fontSize="10" fill="#6b7280">
                Tue
              </text>
              <text x="205" y="190" fontSize="10" fill="#6b7280">
                Wed
              </text>
              <text x="262" y="190" fontSize="10" fill="#6b7280">
                Thur
              </text>
              <text x="330" y="190" fontSize="10" fill="#6b7280">
                Fri
              </text>
              <text x="390" y="190" fontSize="10" fill="#6b7280">
                Sat
              </text>
              <text x="448" y="190" fontSize="10" fill="#6b7280">
                Sun
              </text>
            </svg>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsView;
