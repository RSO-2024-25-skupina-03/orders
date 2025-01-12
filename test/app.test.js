import { expect } from 'chai';
import request from 'supertest';
import app from '../app.js';

describe('GET /health', () => {
  it('should return OK', (done) => {
    request(app)
      .get('/health')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('message', 'OK');
        done();
      });
  });
});