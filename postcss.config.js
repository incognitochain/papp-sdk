module.exports = ({ ctx }) => {
  return ({
    plugins: {
      precss: {},
      autoprefixer: {
        ...ctx ? ctx.options.autoprefixer : {},
      },
    },
  });
};