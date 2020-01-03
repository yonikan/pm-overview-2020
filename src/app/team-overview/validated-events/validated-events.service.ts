import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerEnvService } from 'src/app/core/services/server-env.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ValidatedEventsService {
  individualPlayersReportPollInterval;
  individualPlayersReportJobStatusSucceed;
  individualPlayersReportStatus;
  private userLoginDataSub: Subscription; // maybe preffered local storage - i dont have onDestory to unsebsribe!
  userId: number;

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private serverEnvService: ServerEnvService
  ) { }

  getTeamEventPdfReport(teamEventId: number, reportType: string) {
    this.userLoginDataSub = this.authService
      .getUserLoginDataListener()
      .pipe(
        map(loginData => loginData.userId)
      )
      .subscribe((userId: number) => {
        console.log('userId: ', userId);
        this.userId = userId;
      });

    let pdfReportType;
    if (reportType === 'teamReport') {
      pdfReportType = 'possession';
    } else if (reportType === 'individualReport') {
      pdfReportType = 'individual';
    };

    const payload = {
      teamEventId,
      userId: this.userId,
      reportType: pdfReportType,
      language: 'en'
    };
    const PATH = this.serverEnvService.getBaseUrl();
    this.http.post<any>(`${PATH}/team-event/${teamEventId}/scheduled-jobs`, payload)
      .subscribe(
        (response: any) => {
          if (response.scheduledJobId) {
            const JOB_ID = response.scheduledJobId;
            this.fetchPdfReportData(JOB_ID, teamEventId);
          } else {
            console.log('individual Players Report Error!!!');
            // this.$refs['individualPlayersReportErrorModal'].show()
          }
        },
        (error) => {
          console.log('error: ', error);
        }
      );
  }

  fetchPdfReportData(jobId: number, teamEventId: number) {
    // this.pollPdfReportData(jobId, teamEventId);
    this.individualPlayersReportPollInterval = setInterval(this.pollPdfReportData.bind(this), 3000, jobId, teamEventId);
    setTimeout(() => { 
      this.clearIntervalEndTimer('failedToRetrieve');
    }, 20000);
  }

  pollPdfReportData(jobId: number, teamEventId: number) {
    // const PATH = this.serverEnvService.getBaseUrl();
    this.http.get<any>(`https://footballrest2-stage.playermaker.co.uk/api/v2/team-event/${teamEventId}/scheduled-jobs/status`)
      .subscribe(
        (response: any) => {
          if (response.jobStatus === 'succeed') { // check if status is success, if it is stop polling 
            this.individualPlayersReportJobStatusSucceed = true;
            this.clearIntervalEndTimer('succeedToRetrieve');
          }
          this.individualPlayersReportStatus = response.jobStatus;
        },
        (error) => {
          console.log('error: ', error);
        }
      );
  }

  clearIntervalEndTimer(retStatus: string) {
    clearInterval(this.individualPlayersReportPollInterval);
    if (retStatus === 'succeedToRetrieve') {
      console.log('succeed To Retrieve!!!');
      // this.$refs['individualPlayersReportSuccessModal'].show()
    } else if (retStatus === 'failedToRetrieve' && this.individualPlayersReportJobStatusSucceed === false) {
      console.log('individual Players Report Error!!!');
      // this.$refs['individualPlayersReportErrorModal'].show()
    }
  }
}