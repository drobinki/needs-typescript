

export interface RecordEvent {
    commitId: string,
    committedAt: number,
    name: string,
    streamId: string,
    version: number,
    causationId: string,
    correlationId: string,
    aggregate: string,
    messageId: string,
    active: 1, // using fixed partition like this is an anti-pattern which will be replaced
    event: string
}
