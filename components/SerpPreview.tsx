
import React from 'react';
import { META_TITLE_MAX_LENGTH, META_DESCRIPTION_MAX_LENGTH } from '../constants';

interface SerpPreviewProps {
  title: string;
  description: string;
}

const SerpPreview: React.FC<SerpPreviewProps> = ({ title, description }) => {
    const truncate = (str: string, num: number) => {
        if (str.length <= num) {
            return str;
        }
        return str.slice(0, num) + '...';
    };

    const displayTitle = title || "Your Meta Title Will Appear Here";
    const displayDescription = description || "Your meta description will appear here. Write a compelling summary to attract users from the search results page.";

    return (
        <div className="w-full max-w-2xl p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
            <p className="text-sm text-gray-400">https://www.yourwebsite.com/your-awesome-page</p>
            <h3 className="text-xl text-blue-400 font-medium truncate hover:underline cursor-pointer">
                {truncate(displayTitle, META_TITLE_MAX_LENGTH)}
            </h3>
            <p className="text-sm text-gray-300 mt-1">
                {truncate(displayDescription, META_DESCRIPTION_MAX_LENGTH)}
            </p>
        </div>
    );
};

export default SerpPreview;
