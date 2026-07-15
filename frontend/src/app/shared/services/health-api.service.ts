import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface HealthResponse {
  status: string;
}

@Injectable({ providedIn: 'root' })
export class HealthApiService {
  private readonly apiBaseUrl = 'http://localhost:8080/api/v1';

  constructor(private readonly http: HttpClient) {}

  checkHealth(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.apiBaseUrl}/health`);
  }
}
