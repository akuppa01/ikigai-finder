'use client';

import { motion } from 'framer-motion';
import { Card } from './card';
import NinjaStar from '../NinjaStar';

interface LoadingScreenProps {
  message?: string;
  showSpinner?: boolean;
  className?: string;
}

export default function LoadingScreen({ 
  message = 'Loading...', 
  showSpinner = true,
  className = '' 
}: LoadingScreenProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-sage-50 via-moss-50 to-earth-50 relative overflow-hidden ${className}`}>
      {/* Background Blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sage-100/30 via-moss-100/30 to-earth-100/30"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-sage-200/40 to-moss-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-earth-200/40 to-gold-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Loading Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <Card className="p-8 sm:p-12 text-center bg-white/90 backdrop-blur-sm rounded-xl border-sage-200 max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <NinjaStar size={80} className="mx-auto" />
          </motion.div>

          {showSpinner && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="mb-6"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mx-auto"></div>
            </motion.div>
          )}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-lg sm:text-xl font-medium text-gray-700"
          >
            {message}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="mt-4"
          >
            <div className="flex justify-center space-x-1">
              <motion.div
                className="w-2 h-2 bg-sage-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-2 h-2 bg-sage-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 bg-sage-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </motion.div>
        </Card>
      </div>
    </div>
  );
}
