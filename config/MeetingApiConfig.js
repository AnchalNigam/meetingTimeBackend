let MeetingApiConfig={};
MeetingApiConfig.port=3005;
MeetingApiConfig.allowedCorsOrigin="*";
MeetingApiConfig.env="dev";
MeetingApiConfig.db={
    uri:"mongodb://127.0.0.1:27017/meetingDb"
}
MeetingApiConfig.apiVersion = '/api/v1';

module.exports = {
    port: MeetingApiConfig.port,
    allowedCorsOrigin: MeetingApiConfig.allowedCorsOrigin,
    environment: MeetingApiConfig.env,
    db :MeetingApiConfig.db,
    apiVersion : MeetingApiConfig.apiVersion
};