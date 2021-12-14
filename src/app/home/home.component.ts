import {Component, OnInit} from '@angular/core'
import {Router} from '@angular/router'
import {ElectronService} from '../core/services'
import {CompilerService} from '../services/compiler.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit {
  originalInput = ''
  convertedInput = ''
  pathInput = ''
  solutionSteps: string[] = []
  solverMatrix: string[][] = [
    [ '', '+', '*', '(', ')', 'i', '#' ],
    [ 'E', '', '', "(TE', 1)", '', "(TE', 1)", '' ],
    [ "E'", "(+TE', 2)", '', '', '(e, 3)', '', '(e, 3)' ],
    [ 'T', '', '', "(FT', 4)", '', "(FT', 4)", '' ],
    [ "T'", '(e, 6)', "(*FT', 5)", '', '(e, 6)', '', '(e, 6)' ],
    [ 'F', '', '', '((E), 7)', '', '(i, 8)', '' ],
    // --------------------------------------------------
    [ '+', 'POP', '', '', '', '', '' ],
    [ '*', '', 'POP', '', '', '', '' ],
    [ '(', '', '', 'POP', '', '', '' ],
    [ ')', '', '', '', 'POP', '', '' ],
    [ 'i', '', '', '', '', 'POP', '' ],
    // --------------------------------------------------
    [ '#', '', '', '', '', '', 'ACCEPT' ],
  ]
  uploadedFile: any
  headerMessage = 'Default solver table loaded';

  constructor(
    private readonly router: Router,
    private readonly electronService: ElectronService,
    public readonly compiler: CompilerService
  ) { }

  ngOnInit() {
    console.log('HomeComponent INIT')
    console.log('Electron fs', this.electronService.fs)
  }

  onBrowse() {
    this.electronService.showOpenDialog().then(result => {
      if (result.length > 0) {
        this.pathInput = result[0]
        this.uploadedFile = this.electronService.fs.readFileSync(this.pathInput).toString()
        this.solverMatrix = []
        for (const line of this.uploadedFile.split('\n'))
          this.solverMatrix.push(line.split(';'))
        this.headerMessage = `Custom solver table loaded`
        this.onSolve()
      } else {
        alert('Nothing loaded')
      }
    }).catch(() => {
      alert('Wrong format for solver table')
    })
  }

  onSolve() {
    this.compiler.init(this.convertedInput, this.solverMatrix)
    try {
      this.compiler.solve()
    } catch (e) {
      this.solutionSteps.push(e.toString())
    }
    while (this.solutionSteps.length > 0) this.solutionSteps.pop()
    this.compiler.solution.forEach(step => this.solutionSteps.push(`${step.cell} --> (${step.remainingInput}, ${step.stack}, ${step.appliedRules})`))
  }

  onUpload($event: any) {
    console.log('Uploaded file:', $event)
    this.uploadedFile = $event
  }

  uploadHandler($event: any) {
    console.log('Upload Handler:', $event)
    this.uploadedFile = $event
  }

  originalInputKeyUp() {
    this.convertedInput = this.originalInput.replace(/[0-9]+/g, 'i')
    this.onSolve()
  }

  convertedInputKeyUp() {
    this.originalInput = this.convertedInput
    while (this.originalInput.includes('i')) {
      this.originalInput = this.originalInput.replace('i', Math.floor(Math.random() * 10).toString())
    }
    this.onSolve()
  }
}
