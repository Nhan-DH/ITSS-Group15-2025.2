import axios from '@/lib/axios';

const IS_MOCK = false;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEY = 'gym_member_packages';

const MOCK_PACKAGES = [
  { id: 1, name: 'Gói Cơ Bản', price: 500000, duration: 1, type: 'month', features: ['Gym', 'Tủ đồ'] },
  { id: 2, name: 'Gói VIP 3 Tháng', price: 1200000, duration: 3, type: 'month', features: ['Gym', 'Yoga', 'Xông hơi', 'Khăn tắm'] },
  { id: 3, name: 'Lớp Yoga Nhóm', price: 800000, duration: 1, type: 'month', features: ['Yoga 3 buổi/tuần'] },
];

// Helper functions for localStorage
const getMemberPackagesFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

const saveMemberPackagesToStorage = (packages) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

export const packageService = {
  getPackages: async () => {
    if (IS_MOCK) {
      await delay(500);
      return MOCK_PACKAGES;
    }
    return axios.get('/packages');
  },

  getPackageById: async (id) => {
    if (IS_MOCK) {
      await delay(300);
      return MOCK_PACKAGES.find(p => p.id === parseInt(id));
    }
    return axios.get(`/packages/${id}`);
  },

  createPackage: async (data) => {
    if (IS_MOCK) {
      await delay(700);
      return { ...data, id: Date.now() };
    }
    return axios.post('/packages', data);
  },

  updatePackage: async (id, data) => {
    if (IS_MOCK) {
      await delay(700);
      return { id, ...data };
    }
    return axios.put(`/packages/${id}`, data);
  },

  deletePackage: async (id) => {
    if (IS_MOCK) {
      await delay(400);
      // Get existing packages from localStorage
      const existingPackages = getMemberPackagesFromStorage();
      // Filter out the package to delete
      const updatedPackages = existingPackages.filter(pkg => pkg.id !== id);
      // Save updated packages back to localStorage
      saveMemberPackagesToStorage(updatedPackages);
      return { success: true };
    }
    return axios.delete(`/packages/${id}`);
  },

  updatePackageStatus: async (id, isActive) => {
    return axios.put(`/packages/${id}`, { is_active: isActive });
  },

  registerPackage: async (packageData) => {
    if (IS_MOCK) {
      await delay(1200); // Simulate payment processing time

      // Extract duration from package name (e.g., "Gói 1 Tháng", "Gói 6 Tháng", "Gói 12 Tháng")
      let duration = 1; // default to 1 month
      const durationMatch = packageData.name.match(/Gói\s+(\d+)\s+Tháng/);
      if (durationMatch) {
        duration = parseInt(durationMatch[1]);
      }

      // Calculate end date
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + duration);

      // Create the registered package object
      const registeredPackage = {
        id: Date.now(),
        name: packageData.name,
        price: packageData.price,
        type: packageData.type,
        gender: packageData.gender,
        facilities: packageData.facilities,
        status: 'active',
        registeredDate: new Date().toISOString(),
        startDate: new Date().toISOString(),
        endDate: endDate.toISOString(),
        duration: duration,
        paymentMethod: packageData.paymentMethod,
      };

      // Save to localStorage
      const existingPackages = getMemberPackagesFromStorage();
      existingPackages.push(registeredPackage);
      saveMemberPackagesToStorage(existingPackages);

      // Return the newly registered package
      return registeredPackage;
    }
    return axios.post('/members/packages/register', packageData);
  },

  getMemberPackages: async () => {
    if (IS_MOCK) {
      await delay(500);
      // Retrieve member packages from localStorage
      return getMemberPackagesFromStorage();
    }
    return axios.get('/members/packages');
  },

  renewPackage: async (renewalData) => {
    if (IS_MOCK) {
      await delay(1200); // Simulate payment processing

      // Get existing packages from localStorage
      const existingPackages = getMemberPackagesFromStorage();

      // Find the package being renewed
      const packageIndex = existingPackages.findIndex(pkg => pkg.id === renewalData.packageId);

      if (packageIndex !== -1) {
        // Update the package with new end date
        existingPackages[packageIndex].endDate = renewalData.newEndDate;
        existingPackages[packageIndex].status = 'active';

        // Save updated packages
        saveMemberPackagesToStorage(existingPackages);

        return {
          success: true,
          message: 'Gia hạn gói tập thành công',
          package: existingPackages[packageIndex]
        };
      }

      return { success: false, message: 'Không tìm thấy gói tập' };
    }
    return axios.post('/members/packages/renew', renewalData);
  }
};