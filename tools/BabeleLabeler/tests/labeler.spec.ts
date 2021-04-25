import Labeler from '../src'

describe('Labeler', function () {
  jest.setTimeout(300000);

  it('return label', function (done) {
      // expect(quad).not.toBe(null)
    Labeler.prefetch(['data.predicate.value']).then(() => {
      Labeler.__('http://dati.cdec.it/lod/bio-ext/brother_sisterOf')
      .then(label => {
        console.log(label)
        done()
      })
    })
    // Labeler.__('http://dati.cdec.it/lod/bio-ext/brother_sisterOf')
    //   .then(label => {
    //     console.log(label)
    //     done()
    //   })
  })
})
