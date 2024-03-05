import request from 'supertest';
import app from '../../app';
describe('Various Filtered Responses Tests', () => {
  it('should test a single condition', async () => {
    const response = await request(app)
      .get('/cLZojxk94ous/filteredResponses')
      .query({
        filters: JSON.stringify([
          { id: 'bE2Bo4cGUv49cjnqZ4UnkW', condition: 'equals', value: 'Tom' },
        ]),
      });
    expect(response.body.data.responses.length).toBe(1);
    expect(response.body.data.responses[0].submissionId).toBe(
      '17e08db1-d685-48a2-b88c-b4486a57cfa7'
    );
  });
  it('should test two filter conditions', async () => {
    const response = await request(app)
      .get('/cLZojxk94ous/filteredResponses')
      .query({
        filters: JSON.stringify([
          { id: 'bE2Bo4cGUv49cjnqZ4UnkW', condition: 'equals', value: 'Tom' },
          { id: '4KC356y4M6W8jHPKx9QfEy', condition: 'equals', value: 'Nope' },
        ]),
      });
    expect(response.body.data.responses.length).toBe(1);
    expect(response.body.data.responses[0].submissionId).toBe(
      '17e08db1-d685-48a2-b88c-b4486a57cfa7'
    );
  });

  it('Should find Two Toms with one filter Condition', async () => {
    const response = await request(app)
      .get('/twoToms/filteredResponses')
      .query({
        filters: JSON.stringify([
          { id: 'bE2Bo4cGUv49cjnqZ4UnkW', condition: 'equals', value: 'Tom' },
        ]),
      });
    expect(response.body.data.responses.length).toBe(2);
  });

  it('Should find Two Toms with Two Filter Conditions', async () => {
    const response = await request(app)
      .get('/twoToms/filteredResponses')
      .query({
        filters: JSON.stringify([
          { id: 'bE2Bo4cGUv49cjnqZ4UnkW', condition: 'equals', value: 'Tom' },
          { id: '4KC356y4M6W8jHPKx9QfEy', condition: 'equals', value: 'Nope' },
        ]),
      });
    expect(response.body.data.responses.length).toBe(2);
  });

  it('Should filter by date, one filter condition=less_than', async () => {
    const response = await request(app)
      .get('/cLZojxk94ous/filteredResponses')
      .query({
        filters: JSON.stringify([
          {
            id: 'dSRAe3hygqVwTpPK69p5td',
            condition: 'less_than',
            value: '2024-04-01',
          },
        ]),
      });
    expect(response.body.data.responses.length).toBe(9);
  });

  it('Should filter by date, one filter condition=greater_than', async () => {
    const response = await request(app)
      .get('/cLZojxk94ous/filteredResponses')
      .query({
        filters: JSON.stringify([
          {
            id: 'dSRAe3hygqVwTpPK69p5td',
            condition: 'greater_than',
            value: '1999-10-10',
          },
        ]),
      });
    expect(response.body.data.responses.length).toBe(8);
  });

  it('Should find tom with date, two conditions', async () => {
    const response = await request(app)
      .get('/cLZojxk94ous/filteredResponses')
      .query({
        filters: JSON.stringify([
          {
            id: 'bE2Bo4cGUv49cjnqZ4UnkW',
            condition: 'equals',
            value: 'Tom',
          },
          {
            id: 'dSRAe3hygqVwTpPK69p5td',
            condition: 'greater_than',
            value: '2024-02-23',
          },
        ]),
      });
    expect(response.body.data.responses.length).toBe(1);
  });

  it("Should filter by 'does not equal', it should find everyone but Tom", async () => {
    const response = await request(app)
      .get('/cLZojxk94ous/filteredResponses')
      .query({
        filters: JSON.stringify([
          {
            id: 'bE2Bo4cGUv49cjnqZ4UnkW',
            condition: 'does_not_equal',
            value: 'Tom',
          },
        ]),
      });

    expect(response.body.data.responses.length).toBe(10);
  });

  it("Should filter by 'does not equal', it should find everyone but Tom with date as well", async () => {
    const response = await request(app)
      .get('/cLZojxk94ous/filteredResponses')
      .query({
        filters: JSON.stringify([
          {
            id: 'bE2Bo4cGUv49cjnqZ4UnkW',
            condition: 'does_not_equal',
            value: 'Tom',
          },
          {
            id: 'dSRAe3hygqVwTpPK69p5td',
            condition: 'greater_than',
            value: '1999-01-01',
          },
        ]),
      });

    expect(response.body.data.responses.length).toBe(8);
  });

  it('Should find two Billys by email', async () => {
    const response = await request(app)
      .get('/cLZojxk94ous/filteredResponses')
      .query({
        filters: JSON.stringify([
          {
            id: 'kc6S6ThWu3cT5PVZkwKUg4',
            condition: 'equals',
            value: 'billy@fillout.com',
          },
        ]),
      });

    expect(response.body.data.responses.length).toBe(2);
  });
});
