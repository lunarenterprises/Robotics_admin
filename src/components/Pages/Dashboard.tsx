import React, { useEffect, useState } from "react";
import { Bot, FileText, Users, Mail, TrendingUp, Calendar } from "lucide-react";
import axios from "axios";
import AdminOrderHistory from "./Orderlisttrack/AdminOrderHistory";

const recentActivity = [
  {
    id: 1,
    type: "lead",
    title: "New lead from Dubai Restaurant Group",
    time: "2 hours ago",
    icon: Mail,
    color: "text-green-600 bg-green-100",
  },
  {
    id: 2,
    type: "blog",
    title: 'Published "Robot Maintenance Guide"',
    time: "4 hours ago",
    icon: FileText,
    color: "text-blue-600 bg-blue-100",
  },
  {
    id: 3,
    type: "robot",
    title: "Added new D2 Delivery Robot",
    time: "6 hours ago",
    icon: Bot,
    color: "text-purple-600 bg-purple-100",
  },
  {
    id: 4,
    type: "partner",
    title: "New partnership with UAE AI Council",
    time: "1 day ago",
    icon: Users,
    color: "text-orange-600 bg-orange-100",
  },
];

export default function Dashboard() {
  const [totalRobots, setTotalRobots] = useState(0);
  const [contacts, setContacts] = useState<number>(0);
  const stats = [
    {
      name: "Total Robots",
      value: totalRobots,
      change: "",
      changeType: "increase",
      icon: Bot,
    },
    // { name: 'Blog Posts', value: '128', change: '+5%', changeType: 'increase', icon: FileText },
    {
      name: "Leads",
      value: contacts,
      change: "",
      changeType: "increase",
      icon: Mail,
    },
    // { name: 'Partners', value: '12', change: '+2', changeType: 'increase', icon: Users },
  ];

  useEffect(() => {
    fetchRobots();
    fetchContacts();
  }, []);

  const fetchRobots = async () => {
    try {
      const { data } = await axios.post(
        "https://lunarsenterprises.com:7001/robotics/list/product"
      );
      const robotsArray = Array.isArray(data.list) ? data.list : [];
      setTotalRobots(robotsArray.length);
    } catch (error) {
      console.error("Error fetching robots:", error);
    }
  };

  const fetchContacts = async () => {
    try {
      const { data } = await axios.post(
        "https://lunarsenterprises.com:7001/robotics/list/contactus"
      );
      const contactsArray = Array.isArray(data.list) ? data.list : [];
      setContacts(contactsArray.length);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome to Fortune Robotics Admin
        </h1>
        <p className="text-blue-100">
          Manage your robots, content, and leads from this central dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <item.icon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    {item.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {item.value}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <TrendingUp className="h-4 w-4 flex-shrink-0 self-center" />
                      <span className="ml-1">{item.change}</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="">
        <AdminOrderHistory />
      </div>
    </div>
  );
}
