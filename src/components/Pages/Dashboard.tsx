import React, { useEffect, useState } from 'react';
import { Bot, FileText, Users, Mail, TrendingUp, Calendar } from 'lucide-react';
import axios from 'axios';



const recentActivity = [
  {
    id: 1,
    type: 'lead',
    title: 'New lead from Dubai Restaurant Group',
    time: '2 hours ago',
    icon: Mail,
    color: 'text-green-600 bg-green-100'
  },
  {
    id: 2,
    type: 'blog',
    title: 'Published "Robot Maintenance Guide"',
    time: '4 hours ago',
    icon: FileText,
    color: 'text-blue-600 bg-blue-100'
  },
  {
    id: 3,
    type: 'robot',
    title: 'Added new D2 Delivery Robot',
    time: '6 hours ago',
    icon: Bot,
    color: 'text-purple-600 bg-purple-100'
  },
  {
    id: 4,
    type: 'partner',
    title: 'New partnership with UAE AI Council',
    time: '1 day ago',
    icon: Users,
    color: 'text-orange-600 bg-orange-100'
  }
];

export default function Dashboard() {


    const [totalRobots, setTotalRobots] = useState(0);
  const [contacts, setContacts] = useState<number>(0);
    const stats = [
  { name: 'Total Robots', value: totalRobots, change: '', changeType: 'increase', icon: Bot },
  // { name: 'Blog Posts', value: '128', change: '+5%', changeType: 'increase', icon: FileText },
  { name: 'Leads', value: contacts, change: '', changeType: 'increase', icon: Mail },
  // { name: 'Partners', value: '12', change: '+2', changeType: 'increase', icon: Users },
];


  useEffect(() => {
    fetchRobots();
    fetchContacts();
  }, []);

  const fetchRobots = async () => {
    try {
      const { data } = await axios.post("https://lunarsenterprises.com:7001/robotics/list/product");
      const robotsArray = Array.isArray(data.list) ? data.list : [];
      setTotalRobots(robotsArray.length);
    } catch (error) {
      console.error("Error fetching robots:", error);
    }
  };

  const fetchContacts = async () => {
    try {
      const { data } = await axios.post("https://lunarsenterprises.com:7001/robotics/list/contactus");
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
        <h1 className="text-2xl font-bold mb-2">Welcome to Fortune Robotics Admin</h1>
        <p className="text-blue-100">Manage your robots, content, and leads from this central dashboard.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <item.icon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{item.value}</div>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        {/* <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className={`flex-shrink-0 p-2 rounded-full ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* Quick Actions */}
        {/* <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Bot className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-sm font-medium text-gray-900">Add New Robot</span>
              </button>
              <button className="w-full flex items-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <FileText className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm font-medium text-gray-900">Create Blog Post</span>
              </button>
              <button className="w-full flex items-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Mail className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-sm font-medium text-gray-900">Review Leads</span>
              </button>
              <button className="w-full flex items-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="h-5 w-5 text-orange-600 mr-3" />
                <span className="text-sm font-medium text-gray-900">Schedule Demo</span>
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}