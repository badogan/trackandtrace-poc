# Track and Trace PoC
Track and Trace PoC provides list of uniqueIds who came close to another uniqueId after a certain date/time. It is an effort to answer the track-and-trace question posed by many organizations. It is a PoC (proof-of-concept) hence the technical implementation does not intend to and cannot provide any individually identifiable data.

## FAQ
Q: How does the code "identify" the uniqueIds who came close to a given uniqueId after a certain date/time?
A: As first step, given a noSQL db/collection with many "existence" data points; all data points in the collection after the given date/time which belong to the given uniqueId are identified. Second step is to find out the "existence" data points who came close contact (proximity) to the given uniqueId around the "similar" date/time. Third step involves going through those "existence" data points and extracting a unique list of uniqueIds.

Q: What is "close contact"? What does "similar date/time" mean?
A: Currently, code assumes "close contact" to be less than 5m. "Similar date/time" is considered as 1 min. So, any "existence" data points taken within 1 minute and less than 5m of each other are considered as close proximity. Both parameters are configurable.

Q: Hang on, above would require "searching" and "processing" lots of data points. How do all those technically work?
A: Please get in touch with the author :) Key technical terms are MongoDB aggregation and Redis. Other usual suspects are NodeJS, Express, MongoDB, JS, Jest

## Available Routes
/{{URL}}api/v1/existence/newexistence
A new existence object can be added to a collection "manually"
It accepts cartesian coordinates and coverts it to a GeoJSON with an offset longitude and latitude
Location property is GeoJSON (currently, Point)

{{URL}}api/v1/existence/q1results
Summary. Identify and filter target documents for a uniqueId and starting date.
Description. (1) Uses MongoDB aggregation thru NodeJS controller code and MongoDB node driver
@param  {string}        uniqueId        uniqueId 
@param  {timestamp}     eTimestamp      Starting Date (ISO - so can go to a second if needed)
@param  {number}        maxDistance     maxDistance in meters
@return {string}        refId           job queue reference id

{{URL}}api/v1/existence/jobqueue
Summary. Trigger a request for the uniqueIds to be extracted as a list for a given job reference id. 
Description. Uses MongoDB aggregation thru NodeJS controller code and MongoDB node driver
@param  {string}    jobQueueId      job queue reference id
@return {array}     uniqueList      array of uniqueIds
@return {number}    count           count of uniqueIds

TODO: DONE Accept maxDistance as a query parameter
TODO: (Dev) Prepare a basic entry form and put FE infra in place (React, Redux, ReactRouter, Page + Component structure with initial API wiring)
TODO: (Think) Move to TS on backend code? Write tests and deploy as well? 

## Brainstorming - Potential Next Tasks
TODO: IN PROGRESS - Aggregation addresses this for now. MapReduce (needed?), Sharding: How would those need to be considered? 
TODO: IN PROGRESS - Queue Management needed once the use case is clarified with its integration points and expected user communication during the search
TODO: User Journey - Personas, use cases would help on expectation management and (might) help in some backend app + infra ["How will the user know what is going on? Needed?]
TODO: MongoDB integration on how currently the data enters the system and travels. At which step a new doc created? Would an ongoing data cleanup + summary needed? 
TODO: GeoJSON Object alternatives need to be studied (along with above). Should a "signature object involving start-end dates and polygons" be considered? Or something similar?
TODO: Performance, PoC, Experimentation needed in all stages 

## Organizational Aspects
TODO: Effort, dev and experimentation cannot be done in isolation from the current infra and team. Must be an extension
TODO: Cost, onprem, cloud, admin, signup/login, balance among use of current and redesign/develop and learnings will need to be ongoing