/** @format */

export const randomNunmber = (max, min) => {
  console.log(max, min);
	return Math.random() * (max - min) + min;
};
