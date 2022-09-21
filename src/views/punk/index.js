import {
	Stack,
	Heading,
	Text,
	Table,
	Thead,
	Tr,
	Th,
	Td,
	Tbody,
	Button,
	Tag,
	useToast,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import RequestAccess from "../../components/request-access";
import PunkCard from "../../components/punk-card";
import { usePlatziPunkData } from "../../hooks/usePlatziPunksData";
import { useParams } from "react-router-dom";
import Loading from "../../components/loading";
import { useState } from "react";
import usePlatziPunks from "../../hooks/usePlatziPunks";

const Punk = () => {
	const { active, account, library } = useWeb3React();
	const { tokenId } = useParams();
	const { loading, punk, update } = usePlatziPunkData(tokenId);
	const platziPunks = usePlatziPunks();
	const toast = useToast();
	const [transfering, setTransfering] = useState(false);
	if (!active) return <RequestAccess />;

	if (loading) return <Loading />;

	const transfer = () => {
		setTransfering(true);
		const address = prompt("Enter the address: ");
		const isAddress = library.utils.isAddress(address);

		if (!isAddress) {
			toast({
				title: "Invalid address",
				description: "The address entered is not a valid Ethereum address",
				status: "error",
			});

			setTransfering(false);
		} else {
			platziPunks.methods
				.safeTransferFrom(account, address, punk.tokenId)
				.send({
					from: account,
				})
				.on("error", (e) => {
					toast({
						title: "Transaction failed",
						description: e.message,
						status: "error",
					});
					setTransfering(false);
				})
				.on("transactionHash", (txHash) => {
					toast({
						title: "Transaction sent",
						description: txHash,
						status: "info",
					});
				})
				.on("receipt", () => {
					toast({
						title: "Transaction confirmed",
						description: `Punk #${punk.tokenId} was transfered to ${address}`,
						status: "success",
					});
					setTransfering(false);
					update();
				});
		}
	};

	return (
		<Stack
			spacing={{ base: 8, md: 10 }}
			py={{ base: 5 }}
			direction={{ base: "column", md: "row" }}
		>
			<Stack>
				<PunkCard
					mx={{
						base: "auto",
						md: 0,
					}}
					name={punk.name}
					image={punk.image}
				/>
				{account === punk.owner ? (
					<Button
						colorScheme="green"
						onClick={transfer}
						isLoading={transfering}
					>
						Transfer
					</Button>
				) : (
					""
				)}
			</Stack>
			<Stack width="100%" spacing={5}>
				<Heading>{punk.name}</Heading>
				<Text fontSize="xl">{punk.description}</Text>
				<Text fontWeight={600}>
					DNA:
					<Tag ml={2} colorScheme="green">
						{punk.dna}
					</Tag>
				</Text>
				<Text fontWeight={600}>
					Owner:
					<Tag ml={2} colorScheme="green">
						{punk.owner}
					</Tag>
				</Text>
				<Table size="sm" variant="simple">
					<Thead>
						<Tr>
							<Th>Attribute</Th>
							<Th>Value</Th>
						</Tr>
					</Thead>
					<Tbody>
						{Object.entries(punk.attributes).map(([key, value]) => (
							<Tr key={key}>
								<Td>{key}</Td>
								<Td>
									<Tag>{value}</Tag>
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</Stack>
		</Stack>
	);
};

export default Punk;
