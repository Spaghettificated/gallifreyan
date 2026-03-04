const WordType = 0
const ConsonantTypes = {
    DENT:   1,
    OMEGA:  2,
    INSIDE: 3,
    BORDER: 4,
}
const VowelTypes = {
    A: 0,
    E: 1,
    I: 2,
    O: 3,
    U: 4,
}

export class Word {
    constructor(shape){
        this.shape = shape
        this.letters = []
        this.lines = []
    }
    draw(ctx){
        this.shape?.draw(ctx)
        this.letters.forEach(letter => {
            letter.draw(ctx)
        });
        this.lines.forEach(line => {
            line.draw(ctx)
        });
    }
}
export class Consonant{
    constructor(word, shape){
        this.word = word
        this.shape = shape
        this.dots = []
        this.lines = []
        this.vowel = null
    }
    draw(ctx){
        ctx.lineWidth = 5
        this.shape?.draw(ctx)
        this.lines.forEach(line => {
            line.draw(ctx)
        });
        ctx.lineWidth = 8
    }
}
export class Vowel{
    constructor(parent){
        this.parent = parent
        this.line = null2
    }
}