import React from 'react';

const AboutUs: React.FC = () => {
const stats = [
{ number: '50,000+', label: 'Students Worldwide' },
{ number: '500+', label: 'Expert Courses' },
{ number: '95%', label: 'Success Rate' },
{ number: '24/7', label: 'Learning Support' }
];

const missionCards = [
{
icon: '🎯',
title: 'Expert-Led Learning',
description: 'Learn from industry professionals with real-world experience. Our instructors are carefully selected experts who bring practical knowledge to every course.'
},
{
icon: '🚀',
title: 'Career Advancement',
description: 'Our courses are designed to boost your career prospects. Gain industry-recognized certificates and skills that employers value most.'
},
{
icon: '🌍',
title: 'Global Community',
description: 'Join a worldwide network of learners and professionals. Connect, collaborate, and grow together in our supportive learning environment.'
},
{
icon: '💡',
title: 'Innovative Methods',
description: 'Experience cutting-edge learning technologies and methodologies. We constantly evolve our platform to provide the best learning experience.'
},
{
icon: '🔄',
title: 'Lifetime Access',
description: 'Once enrolled, you have lifetime access to course materials. Learn at your own pace and revisit content whenever you need to refresh your skills.'
},
{
icon: '🏆',
title: 'Industry Recognition',
description: 'Our certificates are recognized by top companies worldwide. Build credibility and showcase your expertise with our industry-verified credentials.'
}
];

return (
<div className="min-h-screen bg-slate-50">


<div className="max-w-6xl mx-auto px-5">
{/* Hero Section */}
<div className="text-center py-16 px-8 my-16 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-3xl shadow-2xl">
<h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
GREAT IDEA<br />
<span className="text-blue-200">GET THEIR</span><br />
GRADE
</h1>
<p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
Transform your career with world-class courses from industry experts. Join millions of learners building the future.
</p>

<div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mt-8">
<span className="text-lg">⚡</span>
<span className="font-medium">Trusted by 50,000+ Students Worldwide</span>
</div>
</div>

{/* Stats Section */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 my-16">
{stats.map((stat, index) => (
<div 
  key={index} 
  className="bg-white p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
>
  <div className="text-4xl font-extrabold text-indigo-600 mb-2">
    {stat.number}
  </div>
  <div className="text-slate-600 font-medium">
    {stat.label}
  </div>
</div>
))}
</div>

{/* Mission Section */}
<div className="bg-white p-16 rounded-3xl my-16 shadow-lg">
<h2 className="text-4xl font-bold text-center mb-12 text-slate-800">
Our Mission
</h2>
<p className="text-center text-xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
At Graidea, we believe that quality education should be accessible to everyone, everywhere. 
We're committed to democratizing learning and empowering individuals to achieve their career goals.
</p>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-12">
{missionCards.map((card, index) => (
  <div key={index} className="text-center group">
    <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 transition-transform duration-300">
      {card.icon}
    </div>
    <h3 className="text-xl font-semibold mb-4 text-slate-800">
      {card.title}
    </h3>
    <p className="text-slate-600 leading-relaxed">
      {card.description}
    </p>
  </div>
))}
</div>
</div>
</div>
</div>
);
};

export default AboutUs;