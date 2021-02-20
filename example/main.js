let app = new IVue({
  el: '#app',
  data: {
    msg: 'hello',
    deep: {
      a: 1,
      b: 2
    }
  },
  methods: {
    clickMe: function () {
      this.msg = 'hello world';
    }
  },
  mounted () {
    setTimeout(() => {
      this.deep.a = '111'
    }, 3000);
  }
})