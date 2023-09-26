import Errors from './error';

export default {
  data() {
    return {
      errors: new Errors(),
      commonError: '',
    };
  },
  methods: {
    setErrors(err) {
      if (
        err.response &&
        err.response.data !== undefined &&
        err.response.data.code === 3
      ) {
        if (err.response.data.messages === undefined) {
          try {
            const error = JSON.parse(err.response.data.message);
            if (error.hasOwnProperty('sentence')) {
              this.commonError = error.sentence;
            }
            for (const field in error.messages) {
              if (error.messages[field] !== undefined) {
                this.errors.record(error.messages);
              }
            }
            this.$toasted.global.error_toast({
              message: 'Please check your inputs',
            });
          } catch (error) {
            this.$toasted.global.error_toast({
              message: err.response.data.message,
            });
          }
        } else {
          this.commonError = err.response.data.message;
        }
      } else {
        this.$toasted.global.error_toast({
          message: err.response.data.message,
        });
      }
    },
    clearErrors() {
      this.errors = new Errors();
    },
    commonErrorMessage(err) {
      try {
        console.log(err);
        let errorMessage = '';
        // eslint-disable-next-line valid-typeof
        if (
          err.response.data !== undefined &&
          err.response.data.code == 3 &&
          typeof err.response.data.message === 'json'
        ) {
          const error = JSON.parse(err.response.data.message);
          errorMessage = error.sentence;
        } else if (
          err.response.data !== undefined &&
          err.response.data.code == 3 &&
          typeof err.response.data.message === 'string'
        ) {
          try {
            const error = JSON.parse(err.response.data.message);
            errorMessage = error.hasOwnProperty('sentence')
              ? error.sentence
              : error;
          } catch (e) {
            errorMessage = err.response.data.message;
          }
        } else {
          errorMessage = err.response.data.message;
        }
        this.$toasted.global.error_toast({ message: errorMessage });
        this.commonError = errorMessage;
      } catch (e) {
        this.$toasted.global.error_toast({ message: 'Something went wrong' });
      }
    },
    clearFieldError(fieldName) {
      this.errors.clear(fieldName);
    },
    offlineCommonErrorMessage(err) {
      throw err;
    },
  },
};
