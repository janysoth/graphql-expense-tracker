import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import Cards from "../components/Cards";
import TransactionForm from "../components/TransactionForm";

import { MdLogout } from "react-icons/md";
import toast from "react-hot-toast";
import { LOGOUT } from "../graphql/mutations/user.mutation";
import { useMutation, useQuery } from "@apollo/client";
import { GET_TRANSACTION_STATISTICS } from "../graphql/queries/transaction.query";
import { useEffect, useState } from "react";
import { GET_AUTHENTICATED_USER } from "../graphql/queries/user.query";

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
  const { data } = useQuery(GET_TRANSACTION_STATISTICS);
  const { data: authUserData } = useQuery(GET_AUTHENTICATED_USER, {
    fetchPolicy: "cache-first", // Use cache-first policy for better performance
  });

  const [logout, { loading, client }] = useMutation(LOGOUT, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "$",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        borderRadius: 30,
        spacing: 10,
        cutout: 120,
      },
    ],
  });

  useEffect(() => {
    if (data?.categoryStatistics) {
      try {
        const categories = data.categoryStatistics.map((stat) => {
          return stat.category.charAt(0).toUpperCase() + stat.category.slice(1);
        });

        const totalAmounts = data.categoryStatistics.map((stat) => stat.totalAmount);

        const colorMap = {
          saving: "rgba(63, 122, 233, 1)",
          expense: "rgba(255, 99, 132)",
          investment: "rgba(54, 162, 235)",
          income: "rgba(28, 166, 120, 1)",
        };

        const backgroundColors = [];
        const borderColors = [];

        categories.forEach((category) => {
          const lowerCaseCategory = category.toLowerCase();
          const defaultColor = "rgba(255, 165, 0, 1)"; // Vibrant orange for default
          backgroundColors.push(colorMap[lowerCaseCategory] || defaultColor);
          borderColors.push(colorMap[lowerCaseCategory] || defaultColor);
        });

        setChartData((prev) => ({
          labels: categories,
          datasets: [
            {
              ...prev.datasets[0],
              data: totalAmounts,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
            },
          ],
        }));
      } catch (error) {
        console.error("Error processing chart data: ", error);
      }
    }
  }, [data]);

  const handleLogout = async () => {
    try {
      await logout();
      client.resetStore(); // Clear the Apollo Client cache
    } catch (error) {
      console.error("Error in logging out: ", error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className='flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center'>
        <div className='flex items-center'>
          <p className='md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text'>
            Spend wisely, track wisely
          </p>
          <img
            src={authUserData?.authUser.profilePicture}
            className='w-11 h-11 rounded-full border cursor-pointer'
            alt='Avatar'
          />
          {!loading && (
            <MdLogout
              className='mx-2 w-5 h-5 cursor-pointer'
              onClick={handleLogout}
              aria-label='Logout' // Added ARIA label for accessibility
            />
          )}
          {/* loading spinner */}
          {loading && <div className='w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin'></div>}
        </div>
        <div className='flex flex-wrap w-full justify-center items-center gap-6'>
          {data?.categoryStatistics.length > 0 && (
            <div className='h-[330px] w-[330px] md:h-[360px] md:w-[360px]'>
              <Doughnut data={chartData} />
            </div>
          )}

          <TransactionForm />
        </div>
        <Cards />
      </div>
    </>
  );
};

export default HomePage;