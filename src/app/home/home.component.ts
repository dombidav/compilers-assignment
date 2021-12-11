import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ElectronService } from '../core/services'

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
  solverMatrix: string[][] = []
  uploadedFile: any

  constructor(
    private readonly router: Router,
    private readonly electronService: ElectronService
  ) { }

  ngOnInit() {
    console.log('HomeComponent INIT')
    console.log('Electron fs', this.electronService.fs)
  }

  onOriginalOk() {
    console.log('Original input:', this.originalInput)
  }

  onConvertedOk() {
    console.log('Converted input:', this.convertedInput)
  }

  onBrowse() {
    console.log('Browse')
    this.electronService.showOpenDialog().then(result => {
      console.log('Result:', result)
      if (result.length > 0) {
        this.pathInput = result[0]
        this.uploadedFile = this.electronService.fs.readFileSync(this.pathInput)
        this.solutionSteps = this.uploadedFile.toString().split('\n')
        this.solverMatrix = this.solutionSteps.map(row => row.split(' '))
        console.log('Solver matrix:', this.solverMatrix)
      }
    })
  }

  onSolve() {
    console.log('Solve')
  }

  onUpload($event: any) {
    console.log('Uploaded file:', $event)
    this.uploadedFile = $event
  }

  uploadHandler($event: any) {
    console.log('Upload Handler:', $event)
    this.uploadedFile = $event
  }
}
